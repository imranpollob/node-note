# node-note
Simple global note-taking CLI (title-only, newest-first)

Install globally and use the `note` command.

Usage
- Add: `note Your note title without quotes`
- List: `note` (shows newest first)
- Find: `note find keyword`
- Edit: `note edit <index> <new title...>`
- Delete: `note rm <index> [--yes]`
- Clear all: `note clear --yes`

Notes are stored per-user in your OS data directory, e.g.,
- Windows: `%APPDATA%/note/notes.json`
- macOS: `~/Library/Application Support/note/notes.json`
- Linux: `~/.local/share/note/notes.json`

The CLI entry point is `bin/note.js` and is exposed as the `note` command when installed globally.
