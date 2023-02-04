const express = require('express');
require('dotenv').config();
const { google } = require("googleapis");
const ytd = require("./src/yt-video-downloader");
const rc = require("./src/reddit-collector");

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
        // ytd.downloadVideoContent(response.data.items[0].id.videoId);
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

    const videoId = req.query.video_id;

    ytd.downloadVideoContent(videoId);

});

app.get('/reddit', (req, res) => {

    rc.getTopPosts().then((posts) => {

        res.send({
            'posts': posts
        });

    });

});





app.listen(8888, () => {
    console.log('listening on 8888')
});