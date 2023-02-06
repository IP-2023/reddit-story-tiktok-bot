const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const backgroundVideo = "background.mp4";
const photo = "photo.png";
const output = "tiktok.mp4";


(function () {
    ffmpeg()
        .input(photo)
        .input(backgroundVideo)
        .complexFilter([
            {
                filter: "overlay",
                options: {
                    x: "(main_w-overlay_w)/2",
                    y: "(main_h-overlay_h)/2"
                },
                inputs: "[1:v][0:v]"
            }
        ])
        .output(output)
        .on("end", function () {
            console.log("Processing finished!");
        })
        .on("error", function (err) {
            console.log("An error occurred: " + err.message);
        })
        .run();
})();
