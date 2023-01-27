const express = require('express');
require('dotenv').config();
const { google } = require("googleapis");
const youtubedl = require('youtube-dl-exec')

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
        maxResults: 5,
        type: "video",
        videoDuration: "short"

    }).then(response => {
        console.log(`first video id: ${response.data.items[0].id.videoId}`);
        downloadVideoContent(response.data.items[0].id.videoId);
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

app.get('/download', (req, res) => {

    const testId = '4In8wOZreGQ';
    console.log('attempting to download content...');
    downloadVideoContent(testId);

});


const downloadVideoContent = (videoId) => {
    youtubedl(`https://www.youtube.com/watch?v=${videoId}`, {
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
        addHeader: [
            'referer:youtube.com',
            'user-agent:googlebot'
        ]

    }).then((output) => {
        console.log(output);
    });
}



app.listen(8888, () => {
    console.log('listening on 8888')
});


// 4In8wOZreGQ

// https://youtu.be/RmOq1pNzzwI