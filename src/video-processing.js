const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const backgroundVideo = "testing-content/background.mp4";
const photo = "testing-content/photo.png";
const ttsAudio = "testing-content/tts.mp3"
const output = "tiktok.mp4";


(function () {
    ffmpeg()
        .input(photo)
        .input(backgroundVideo)
        .input(ttsAudio)
        .complexFilter([
            {
                filter: 'scale',
                options: 'iw/3:-1',
                inputs: '[0:v]',
                outputs: 'scaled'
            },
            { // first image overlayed
                filter: 'overlay',
                options: {
                    x: '(main_w-overlay_w)/2',
                    y: '50'
                },
                inputs: ['1:v', 'scaled'],
                outputs: 'overlayed'
            },
            // { // second image overlayed
            //     filter: 'overlay',
            //     options: {
            //         x: '(main_w-overlay_w)/2',
            //         y: '(main_h-overlay_h)/2',
            //         enable: 'between(t,10,20)'
            //     },
            //     inputs: ['2:v'],
            //     outputs: 'overlayed2'
            // },
            {
                filter: 'volume',
                options: {
                    enable: 'between(t,0,20)',
                    volume: 0
                },
                inputs: '1:a',
                outputs: 'muted'
            },
            {
                filter: 'amix',
                options: {
                    inputs: 2,
                    duration: 'longest'
                },
                inputs: ['2:a', 'muted']
            },
            {
                filter: 'crop',
                options: `9/16*ih:ih`,
                inputs: ['overlayed']
            }

        ]) // add overlayed2 to crop for second image overlay (and second audio overlay)
        .output(output)
        .on("end", () => {
            console.log("Processing finished!");
        })
        .on("error", (err) => {
            console.log("An error occurred: " + err.message);
        })
        .run();
})();