const youtubedl = require('youtube-dl-exec');
// youtubedl require python 3.7+

const downloadVideoContent = (videoId) => {
    console.log(`attempting to download video ${videoId}`);

    youtubedl(`https://www.youtube.com/watch?v=${videoId}`, {
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
        addHeader: [
            'referer:youtube.com',
            'user-agent:googlebot'
        ]

    });
};


module.exports = { downloadVideoContent };