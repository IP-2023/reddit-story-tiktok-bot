const youtubedl = require('youtube-dl-exec');
// youtubedl require python 3.7+
//n_Dv4JMiwK8
// short:  JYs_94znYy0

const downloadVideoContent = async (videoId) => {
    console.log(`attempting to download video ${videoId}`);

    const options = {
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
        addHeader: [
            'referer:youtube.com',
            'user-agent:googlebot'
        ],
        output: `${videoId}.mp4`,
        downloadSections: '*1:15-inf' // Download seconds 93 to 111
    };

    youtubedl(`https://www.youtube.com/watch?v=${videoId}`, options).catch((error) => { console.log(error) });

};


module.exports = { downloadVideoContent };