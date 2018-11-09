const fs = require('fs')

let addNote = (title, body) => {
    let content = []
    
    try {
        let previous = fs.readFileSync('notes.json')
        content = JSON.parse(previous)
    } catch (e) {
        
    }

    content.push({title: body})

    fs.writeFileSync('notes.json', JSON.stringify(content))
}

let listNote = () => {
    console.log('all');    
}

let getNote = (title) => {
    console.log('all');    
}

let deleteNote = (title) => {
    console.log('all');    
}

module.exports = {
    addNote,
    listNote,
    getNote,
    deleteNote
}