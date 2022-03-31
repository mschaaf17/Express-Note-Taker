//server will make the localport
//post/api/notes
//you wil need api routes with notes.js and index.js
//you will need a html routes-- this is all the router.get paths

//route to the data to save the notes
const { notes } = require('./db/db.json')
const express = require('express')

//initiate server
const app = express()



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

//using app variable chain listen to make the server listen
app.listen(3001, () => {
    console.log(`API server is now on port 3001!`)
})


//save to heroku-- git add . git commit and then git push heroku main