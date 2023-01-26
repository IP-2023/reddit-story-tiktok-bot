const express = require('express');
require('dotenv').config();
const { google } = require("googleapis");

const API_KEY = process.env.API_KEY;


const app = express();
app.use(express.static(__dirname + '/public'));


const youtube = google.youtube({
    version: 'v3',
    auth: API_KEY
});


app.get('/search', (req, res) => {

    const searchQuery = req.query.search_query;

    youtube.search.list({
        part: 'snippet',
        q: searchQuery,
        maxResults: 5
    }).then(response => {
        res.send({
            'result': response.data.items
        });
        console.log('success!');
    }).catch(err => {
        res.send({
            'error': err
        })
        console.log(err);
    });
});



console.log('listening on 8888');
app.listen(8888);