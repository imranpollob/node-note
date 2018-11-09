const fs = require('fs')
const _ = require('lodash')
const yargs = require('yargs')

const notes = require('./notes.js')

const argv = yargs.argv
let command = argv._[0]

if (command === 'add') {
    notes.addNote(argv.title, argv.body) !== undefined ? console.log('Note Created Successfully!!') : console.log('Note title already exits');
} else if (command === 'list') {
    let _notes = notes.listNote()
    console.log(`You have ${_notes.length} note(s)`)
    _notes.map(note => console.log(`${note.title} - ${note.body}`))
} else if (command === 'get') {
    let note = notes.getNote(argv.title)
    note !== undefined ? console.log(`${note.title} - ${note.body}`) : console.log('No note found')
} else if (command === 'delete') {
    notes.deleteNote(argv.title) === true ? console.log('Note deleteed successfully!!') : console.log('No note found')
} else {
    console.log('Invalid Command')
}