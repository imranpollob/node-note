const fs = require('fs')

let fetchNotes = () => {
    try {
        let previous = fs.readFileSync('notes.json')
        return JSON.parse(previous)
    } catch (e) {
        return []
    }
}

let saveNote = (content) => {
    fs.writeFileSync('notes.json', JSON.stringify(content))
}

let addNote = (title, body) => {
    let content = fetchNotes()
    let note = { title, body }

    if (content.filter(item => item.title === title).length == 0) {
        content.push(note)
        saveNote(content)
        return content
    }
}

let listNote = () => {
    console.log('all');    
}

let getNote = (title) => {
    console.log('all');    
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