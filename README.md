# node-note-cli
A simple CLI tool for managing global notes by title, sorted newest-first.

Install globally and use the `note` command.

## Usage
- Add: `note Your note title without quotes`
- List: `note` (shows newest first)
- Find: `note find keyword`
- Edit: `note edit <index> <new title...>`
- Delete: `note rm <index> [--yes]`
- Clear all: `note clear --yes`

## Examples

- **Add a note:**
  ```
  note Buy groceries
  ```
  Output:
  ```
  Added: Buy groceries
  ```

- **List all notes:**
  ```
  note
  ```
  Output:
  ```
  1. Buy groceries
  2. Call Alice
  3. Finish report
  ```

- **Find notes containing a keyword:**
  ```
  note find gro
  ```
  Output:
  ```
  1. Buy groceries
  ```

- **Edit a note (e.g., change note #2):**
  ```
  note edit 2 Call Bob
  ```
  Output:
  ```
  Updated note 2: Call Bob
  ```

- **Delete a note (e.g., remove note #3):**
  ```
  note rm 3 --yes
  ```
  Output:
  ```
  Deleted note 3: Finish report
  ```

- **Clear all notes:**
  ```
  note clear --yes
  ```
  Output:
  ```
  All notes deleted.
  ```


## Store Location
Notes are stored per-user in your OS data directory, e.g.,
- Windows: `%APPDATA%/note/notes.json`
- macOS: `~/Library/Application Support/note/notes.json`
- Linux: `~/.local/share/note/notes.json`

The CLI entry point is `bin/note.js` and is exposed as the `note` command when installed globally.
