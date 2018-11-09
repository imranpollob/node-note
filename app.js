console.log('app.js')

const fs = require('fs')
const _ = require('lodash')
const yargs = require('yargs')

const notes = require('./notes.js')

const argv = yargs.argv
let command = argv._[0]

if (command === 'add') {
    notes.addNote(argv.title, argv.body) !== undefined ? console.log('Note Created Successfully!!') : console.log('Note title already exits');
} else if (command === 'list') {
    notes.listNote()
} else if (command === 'get') {
    notes.getNote(argv.title)
} else if (command === 'delete') {
    notes.deleteNote(argv.title)
} else {
    console.log('Invalid Command')
}