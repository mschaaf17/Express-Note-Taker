//server will make the localport
//post/api/notes
//you wil need api routes with notes.js and index.js
//you will need a html routes-- this is all the router.get paths

//route to the data to save the notes
const { notes } = require('./db/db.json')
const express = require('express')
const fs = require('fs')
const path = require('path')

//initiate server
const app = express()

//these to app.use need to be there everytime you are looking to accept post data
//parse incoming string or array data-- creates the data and converts it to a key value pairing to access it in the req body
app.use(express.urlencoded({ extended: true}))
//parse incoming JSON data-- this is middle wear the use
app.use(express.json())

//add the route to show all the saved notes-- this is more likely what you need
// app.get('/api/notes', (req, res) => {
//     res.json(notes)
// })


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

//function the for id-- may not need the filtering but I will need to create ids for each note that is saved
function findById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0]
    return result
}


//accept the POST routes req.body value and the array we want to add the data to
//this will be executed in the app.post callback function so it will take a new note and add it to the notes array we passed in and then write the new array data to notes.json
function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note)
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
    )
    //our functions main code will go here
    //return finished code to post route for response
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


//add query to show only specified items
//you likely only need the other request because you won't have a button to filter results
//if you need to filter something from an array check 11.1.5
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
//req.body to package up the data and send it to the server-req.body we access the data and do something with it--write to file
//test a post without a fetch in the front end you need to use insomina
app.post('/api/notes', (req, res) => {
    //set id based on what the next index of array will be
    req.body.id = notes.length.toString()
    
    //if any data in req.body is incorrect, send 404 error back
    if (!validateNote(req.body)) {
        res.status(400).send('THE note is not properly formated.')
    } else {
    //add notes to json file and notes array in this function
    const note = createNewNote(req.body, notes)
    //req.body is where our incoming content will be
    //console.log(req.body.id)
    //this will send the data back to the client
    res.json(note)
}
})

//using app variable chain listen to make the server listen
app.listen(3001, () => {
    console.log(`API server is now on port 3001!`)
})


//save to heroku-- git add . git commit and then git push heroku main