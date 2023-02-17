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
                y: '(main_h-overlay_h)/2',
                enable: `between(t,${durations[i]},${(durations[i] + durations[i + 1])})`
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
                enable: `between(t,0,-1)`,
                volume: 0
            },
            inputs: '0:a',
            outputs: 'muted'
        },
        { // overlay audio
            filter: 'amix',
            options: {
                inputs: 2,
                duration: 'longest',
                enable: `between(t,${durations[i]},${(durations[i] + durations[i + 1])})`
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