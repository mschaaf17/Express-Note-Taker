//route to the data to save the notes
let { notes } = require('./db/db.json')
const express = require('express')
const fs = require('fs')
const path = require('path')

//initiate server
const app = express()

//parse incoming string or array data-- 
app.use(express.urlencoded({ extended: true }))
//parse incoming JSON data
app.use(express.json())
//use extended files for the html 
app.use(express.static('public'))


//accept the POST routes req.body value and the array we want to add the data to
function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note)
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
    )
    return note
}

// function deleteNote(body, notesArray) {
//     const note = body;

// }


//get the updated notes.json file
app.get('/api/notes', (req, res) => {
    let results = notes;
    // if(req.query) {
    //     results = filterByQuery(req.query, results)
    // }
    res.json(results)
})


//listening for a post request-- this is the client requesting the server to accept data
app.post('/api/notes', (req, res) => {
    //set id based on what the next index of array will be
    req.body.id = notes.length.toString()
    const note = createNewNote(req.body, notes)
    res.json(note)
})

//set up delete
app.delete('/api/notes/:id', (req, res) => {
    let newNotes = []
    let deleteId = req.params.id
    console.log(deleteId)
    for (i = 0; i < notes.length; i++) {
        if (notes[i].id !== deleteId) {
            newNotes.push(notes[i])
        }
    }
    console.log(newNotes)
    notes = newNotes
    fs.writeFile("./db/db.json", JSON.stringify({ notes: newNotes }), (err) => {
        if (err) throw err
        res.json(newNotes)
    })
})



//this is to display the index when the server is running on local host
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
})


//using app variable chain listen to make the server listen
app.listen(3001, () => {
    console.log(`API server is now on port 3001!`)
})


//save to heroku-- git add . git commit and then git push heroku main