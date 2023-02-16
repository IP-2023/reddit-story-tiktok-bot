const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const backgroundVideo = "testing-content/background.mp4";

const redditPost = "testing-content/screenshot-0.png";
const comment1 = "testing-content/screenshot-1.png";
const comment2 = "testing-content/screenshot-2.png";
const comment3 = "testing-content/screenshot-3.png";

const postTTS = "testing-content/tts-0.mp3";
const comment1TTS = "testing-content/tts-1.mp3";
const comment2TTS = "testing-content/tts-2.mp3";
const comment3TTS = "testing-content/tts-3.mp3";

const photos = [redditPost, comment1, comment2, comment3];
const tts = [postTTS, comment1TTS, comment2TTS, comment3TTS];

const output = "tiktok.mp4";

(function () {
    let command = ffmpeg().input(backgroundVideo);
    for (let i = 0; i < photos.length; i++) {
        command = command.input(photos[i]).complexFilter([
            { //scale image
                filter: 'scale',
                options: 'iw/3:-1',
                inputs: `[${i + 1}:v]`,
                outputs: 'scaled'
            },
            { // overlay image
                filter: 'overlay',
                options: {
                    x: '(main_w-overlay_w)/2',
                    y: `${50 * i}`,
                    enable: 'between(t,0,10)'
                },
                inputs: [`${i + 1}:v`, '0:v'],
                outputs: `overlayed${i}`
            },
            { // crop video
                filter: 'crop',
                options: `9/16*ih:ih`,
                inputs: `overlayed${i}`
            },
        ]);
    };
    for (let i = 0; i < tts.length; i++) {
        command = command.input(tts[i]).complexFilter([
            { // mute background video
                filter: 'volume',
                options: {
                    enable: 'between(t,0,20)',
                    volume: 0
                },
                inputs: '0:a',
                outputs: 'muted'
            },
            { // overlay audio
                filter: 'amix',
                options: {
                    inputs: 2,
                    duration: 'longest'
                },
                inputs: [`${i + 1 + photos.length}:a`, 'muted']
            },
        ]);
    };

    command.output(output)
        .on("end", () => {
            console.log("Processing finished!");
        })
        .on("error", (err) => {
            console.log("An error occurred: " + err.message);
        })
        .run();
})();



        // // Get the duration of the audio file using ffprobe
        // ffmpeg.ffprobe(pair.audio, (err, metadata) => {
        //     if (err) {
        //         console.error(err);
        //         return;
        //     };
        //     const overlayDuration = metadata.format.duration;
        //     console.log(overlayDuration);
        //     overlayDuration;

        // }).then((overlayDuration) => {
        // });