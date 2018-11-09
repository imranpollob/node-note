const fs = require('fs')

let fetchNotes = () => {
    try {
        let previous = fs.readFileSync('notes.json')
        return JSON.parse(previous)
    } catch (e) {
        return []
    }
}

let saveNote = (notes) => {
    fs.writeFileSync('notes.json', JSON.stringify(notes))
}

let addNote = (title, body) => {
    let notes = fetchNotes()
    let note = { title, body }

    if (notes.filter(item => item.title === title).length == 0) {
        notes.push(note)
        saveNote(notes)
        return notes
    }
}

let listNote = () => {
    return fetchNotes()
}

let getNote = (title) => {
    return fetchNotes().find(note => note.title === title)  
}

let deleteNote = (title) => {
    let notes = fetchNotes()
    let filteredNotes = notes.filter(note => note.title !== title)

    if (notes.length === filteredNotes.length) {
        return false
    } else {
        saveNote(filteredNotes)
        return true
    }
}

module.exports = {
    addNote,
    listNote,
    getNote,
    deleteNote
}