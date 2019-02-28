const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const express = require('express');
const cors = require('cors');
const app = express();
const Airtable = require('airtable');

// Automatically allow cross-origin requests
app.use(cors({
    origin: true
}));

app.get('/', (req, res) => {
    res.send("Hello world")
})

app.post('/isloggedon', (req, res) => {
    res.send(req.body)
})

app.post('/isvalid', (req, res) => {
    let cstate = req.body.currentstate
    let fstate = req.body.futurestate
    checkerrules(cstate, fstate, (res) => {

    })
    res.send(Boolean)
})

app.post('/getairtable', (req, res) => {
    var baseurl = req.body.baseurl
    var apikey = req.body.apikey
    var arr = []
    var base = new Airtable({ apiKey: apikey }).base(baseurl);
    base('Projects').select({
        // Selecting the first 3 records in Grid view:
        maxRecords: 3,
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        records.forEach(function (record) {
            arr.push(record)
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();

    }, function done(err) {
        if (err) { console.error(err); return; }
        else {
            res.cookie('projectdata', 'test')
            res.status('400').redirect('/viewtable.html')
        }
    });
    

})

const main = express()
main.use('/api', app)

exports.main = functions.https.onRequest((req, res) => {
    if (!req.path) {
        req.url = `/${req.url}`
    }
    return main(req, res)
})



