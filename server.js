//route to the data to save the notes
const { notes } = require('./db/db.json')
const express = require('express')
const fs = require('fs')
const path = require('path')

//initiate server
const app = express()

//parse incoming string or array data-- 
app.use(express.urlencoded({ extended: true}))
//parse incoming JSON data
app.use(express.json())
//use extended files for the html 
app.use(express.static('public'))


//function to filter to through specific notes
//unless you add a button to filter by certain notes you may not need this function
function filterByQuery(query, notesArray) {
    let filteredResults = notesArray;
    if(query.title) {
        filteredResults = filteredResults.filter(note => note.title === query.title);
     }
     if(query.text) {
         filteredResults = filteredResults.filter(note => note.text === query.text);
     }
     return filteredResults;
}

//function the for id
function findById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0]
    return result
}


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

function validateNote(note) {
    if (!note.title || typeof note.title !== 'string') {
        return false;
    }
    if(!note.text || typeof note.text !== 'string') {
        return false
    }
    return true;
}


//get the updated notes.json file
app.get('/api/notes', (req, res) => {
    let results = notes;
    if(req.query) {
        results = filterByQuery(req.query, results)
    }
    res.json(results)
})


//this will create the get route for notes by id
app.get('/api/notes/:id', (req, res) => {
    const result = findById(req.params.id, notes)
    if (result) {
        res.json(result)
    } else {
        res.sendStatus(404)
    }
})

//listening for a post request-- this is the client requesting the server to accept data
app.post('/api/notes', (req, res) => {
    //set id based on what the next index of array will be
    req.body.id = notes.length.toString()
    
    
    //if any data in req.body is incorrect, send 404 error back
    if (!validateNote(req.body)) {
        res.status(400).send('THE note is not properly formated.')
    } else {
    //add notes to json file and notes array in this function
    const note = createNewNote(req.body, notes)

    //send the data back to the client
    res.json(note)
}
})
//set up delete
// app.delete('/api/notes:id', (req, res) => {
//     let noteId = parseInt(res.params.id)
//     console.log(noteId)

//     for (i = 0; i < note) 
// }) 



//this is to display the index when the server is running on local host
app.get('/', (req, res)=> {
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