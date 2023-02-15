const youtubedl = require('youtube-dl-exec');
const ytdl = require('ytdl-core');
const fs = require('fs');
// youtubedl require python 3.7+
//n_Dv4JMiwK8

const downloadVideoContent = async (videoId) => {
    console.log(`attempting to download video ${videoId}`);
    const videoURL = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;


    // youtubedl(`https://www.youtube.com/watch?v=${videoId}`, {
    //     noCheckCertificates: true,
    //     noWarnings: true,
    //     preferFreeFormats: true,
    //     addHeader: [
    //         'referer:youtube.com',
    //         'user-agent:googlebot'
    //     ]

    // });
    // Get video information
    // Get video information




};


module.exports = { downloadVideoContent };