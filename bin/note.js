#!/usr/bin/env node
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const APP_NAME = "note"; // used for data dir

function getDataDir() {
  const home = os.homedir();
  const platform = process.platform;
  let base;
  if (platform === "win32") {
    base = process.env.APPDATA || path.join(home, "AppData", "Roaming");
  } else if (platform === "darwin") {
    base = path.join(home, "Library", "Application Support");
  } else {
    base = process.env.XDG_DATA_HOME || path.join(home, ".local", "share");
  }
  return path.join(base, APP_NAME);
}

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getStorePath() {
  const dir = getDataDir();
  ensureDirSync(dir);
  return path.join(dir, "notes.json");
}

function readJSON(file) {
  try {
    const data = fs.readFileSync(file, "utf8");
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function atomicWriteJSON(file, value) {
  const tmp = file + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2));
  fs.renameSync(tmp, file);
}

function nowISO() {
  return new Date().toISOString();
}

function byCreatedDesc(a, b) {
  return new Date(b.createdAt) - new Date(a.createdAt);
}

function relTime(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diffMs / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  const y = Math.floor(mo / 12);
  return `${y}y ago`;
}

function loadNotes() {
  return readJSON(getStorePath());
}

function saveNotes(notes) {
  atomicWriteJSON(getStorePath(), notes);
}

function printList(notes) {
  if (!notes.length) {
    console.log("No notes.");
    return;
  }
  notes.sort(byCreatedDesc);
  notes.forEach((n, idx) => {
    const idx1 = idx + 1;
    const when = relTime(n.updatedAt || n.createdAt);
    console.log(`#${idx1}  ${n.title}  ·  ${when}`);
  });
}

function resolveByIndex(arg, notesSorted) {
  if (!arg) return null;
  const maybeIndex = Number(arg);
  if (Number.isInteger(maybeIndex) && maybeIndex >= 1 && maybeIndex <= notesSorted.length) {
    return { note: notesSorted[maybeIndex - 1], index: maybeIndex - 1 };
  }
  return null;
}

function showHelp() {
  console.log(`note - a tiny notes CLI\n\nUsage:\n  note <title...>           Add a note (title only)\n  note                      List notes (newest first)\n  note find <query>         Search by substring\n  note edit <index> <new title...>\n  note rm <index> [--yes]\n  note clear [--yes]        Delete all notes\n\nTip: Use an index from the current list, e.g., 'note rm 1'\n`);
}

function main() {
  const args = process.argv.slice(2);
  const commands = new Set(["find", "edit", "rm", "del", "delete", "clear", "help", "--help", "-h"]);

  if (args.length === 0) {
    const notes = loadNotes().sort(byCreatedDesc);
    printList(notes);
    return;
  }

  const cmd = args[0];

  if (cmd === "help" || cmd === "--help" || cmd === "-h") {
    showHelp();
    return;
  }

  if (cmd === "find") {
    const q = args.slice(1).join(" ").toLowerCase();
    if (!q) { console.error("Please provide a search query."); process.exit(1); }
    const notes = loadNotes().sort(byCreatedDesc);
    const matches = notes.filter(n => n.title.toLowerCase().includes(q));
    printList(matches);
    return;
  }

  if (cmd === "edit") {
    const ident = args[1];
    const newTitle = args.slice(2).join(" ").trim();
    if (!ident || !newTitle) {
      console.error("Usage: note edit <index> <new title...>");
      process.exit(1);
    }
    const notes = loadNotes().sort(byCreatedDesc);
    const res = resolveByIndex(ident, notes);
    if (!res) { console.error("Note not found."); process.exit(1); }
    const { note } = res;
    note.title = newTitle;
    note.updatedAt = nowISO();
    saveNotes(notes);
    console.log("Updated:", note.title);
    return;
  }

  if (cmd === "rm" || cmd === "del" || cmd === "delete") {
    const ident = args[1];
    const yes = args.includes("--yes") || args.includes("-y");
    if (!ident) {
      console.error("Usage: note rm <index> [--yes]");
      process.exit(1);
    }
    let notes = loadNotes().sort(byCreatedDesc);
    const res = resolveByIndex(ident, notes);
    if (!res) { console.error("Note not found."); process.exit(1); }
    const { note: target, index } = res;
    const promptAndDelete = () => {
      notes.splice(index, 1);
      saveNotes(notes);
      console.log("Deleted:", target.title);
    };
    if (yes) {
      promptAndDelete();
    } else {
      process.stdout.write(`Delete "${target.title}"? (y/N) `);
      process.stdin.setEncoding("utf8");
      process.stdin.once("data", (d) => {
        const input = String(d).trim().toLowerCase();
        if (input === "y" || input === "yes") {
          promptAndDelete();
        } else {
          console.log("Aborted.");
        }
        process.stdin.pause();
      });
      process.stdin.resume();
    }
    return;
  }

  if (cmd === "clear") {
    const yes = args.includes("--yes") || args.includes("-y");
    if (!yes) {
      console.log("This will delete all notes. Re-run with --yes to confirm.");
      process.exit(1);
    }
    saveNotes([]);
    console.log("All notes cleared.");
    return;
  }

  // Default: treat all args as a new note title (no quotes required)
  if (!commands.has(cmd)) {
    const title = args.join(" ").trim();
    if (!title) { console.error("Cannot add empty note."); process.exit(1); }
    const notes = loadNotes();
    const note = { title, createdAt: nowISO(), updatedAt: null };
    notes.push(note);
    saveNotes(notes);
    console.log("Added:", title);
    return;
  }

  // Fallback to help if unknown command pattern reached
  showHelp();
}

main();
