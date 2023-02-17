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
    // get the length of each tts audio file using ffprobe and wait for each to finish before continuing
    let promises = [0];
    for (let i = 0; i < tts.length; i++) {
        promises.push(new Promise((resolve, reject) => {
            ffmpeg.ffprobe(tts[i], (err, metadata) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(metadata.format.duration);
                }
            });
        }));
    };
    Promise.all(promises).then((durations) => {
        console.log(durations);
        ffmpeg()
            .input(backgroundVideo)
            .input(photos[0])
            .input(tts[0])
            .input(photos[1])
            .input(tts[1])
            .input(photos[2])
            .input(tts[2])
            .input(photos[3])
            .input(tts[3])
            .complexFilter([
                // scaling reddit screenshots
                {
                    filter: 'scale',
                    options: 'iw/3:-1',
                    inputs: '[1:v]',
                    outputs: 'sc1'
                },
                {
                    filter: 'scale',
                    options: 'iw/3:-1',
                    inputs: '[3:v]',
                    outputs: 'sc2'
                },
                {
                    filter: 'scale',
                    options: 'iw/3:-1',
                    inputs: '[5:v]',
                    outputs: 'sc3'
                },
                {
                    filter: 'scale',
                    options: 'iw/3:-1',
                    inputs: '[7:v]',
                    outputs: 'sc4'
                },
                // overlaying them on the background footage
                {
                    filter: 'overlay',
                    options: {
                        x: '(main_w-overlay_w)/2',
                        y: '(main_h-overlay_h)/2',
                        enable: `between(t,${durations[0]},${(durations[0] + durations[1])})`
                    },
                    inputs: ['0:v', 'sc1'],
                    outputs: 'overlayed1'
                },
                {
                    filter: 'overlay',
                    options: {
                        x: '(main_w-overlay_w)/2',
                        y: '(main_h-overlay_h)/2',
                        enable: `between(t,${durations[1]},${(durations[1] + durations[2])})`
                    },
                    inputs: ['0:v', 'sc2'],
                    outputs: 'overlayed2'
                },
                {
                    filter: 'overlay',
                    options: {
                        x: '(main_w-overlay_w)/2',
                        y: '(main_h-overlay_h)/2',
                        enable: `between(t,${durations[2]},${(durations[2] + durations[3])})`
                    },
                    inputs: ['0:v', 'sc3'],
                    outputs: 'overlayed3'
                },
                {
                    filter: 'overlay',
                    options: {
                        x: '(main_w-overlay_w)/2',
                        y: '(main_h-overlay_h)/2',
                        enable: `between(t,${durations[3]},${(durations[3] + durations[4])})`
                    },
                    inputs: ['0:v', 'sc4'],
                    outputs: 'overlayed4'
                },
                // mute the background footage
                {
                    filter: 'volume',
                    options: {
                        // enable: 'between(t,0,20)',
                        volume: 0
                    },
                    inputs: '0:a',
                    outputs: 'muted'
                },
                // overlay tts audio on top of the background footage
                {
                    filter: 'amix',
                    options: {
                        inputs: 2,
                        duration: 'first'
                    },
                    inputs: ['2:a', 'muted']
                },
                {
                    filter: 'amix',
                    options: {
                        inputs: 2,
                        duration: durations[2]
                    },
                    inputs: ['4:a', 'muted']
                },
                {
                    filter: 'amix',
                    options: {
                        inputs: 2,
                        duration: durations[3]
                    },
                    inputs: ['6:a', 'muted']
                },
                {
                    filter: 'amix',
                    options: {
                        inputs: 2,
                        duration: durations[4]
                    },
                    inputs: ['8:a', 'muted']
                },
                // crop the final product
                {
                    filter: 'crop',
                    options: `9/16*ih:ih`,
                    inputs: ['overlayed1', 'overlayed2', 'overlayed3', 'overlayed4'],
                }
            ])
            .output(output)
            .on("end", () => {
                console.log("Processing finished!");
            })
            .on("error", (err) => {
                console.log("An error occurred: " + err.message);
            })
            .run();
    }).catch((err) => {
        console.log(err);
    });

    // crop has invalid argument
    // amix has unrecognized options
    // only the first screenshot is overlayed

})();