const ENDPOINT = 'https://tiktok-tts.weilnet.workers.dev';
const textEncoder = new TextEncoder();


const checkAPI = async () => {
    const req = await fetch(`${ENDPOINT}/api/status`);
    const resp = await req.json();
    if (resp.data) {
        if (resp.data.available) {
            console.log(`${resp.data.meta.dc} (age ${resp.data.meta.age} minutes) is able to provide service`);
            return 200;
        } else {
            console.log(`${resp.data.meta.dc} (age ${resp.data.meta.age} minutes) is unable to provide service`);
            console.log(
                `Service not available: ${resp.data.message && resp.data.message.length > 1 ? ` "${resp.data.message}"` : ''}, try again later`
            );
        };
    } else {
        console.log('Error querying API status, try again later');
    };
};


const synthesizeSpeech = async (text, voice) => {

    const textLength = textEncoder.encode(text).length;

    const TEXT_BYTE_LIMIT = 300;

    if (textLength > TEXT_BYTE_LIMIT) {
        console.log(`Text must not be over ${TEXT_BYTE_LIMIT} UTF-8 characters`);
        return 400;
    };

    try {
        const req = await fetch(`${ENDPOINT}/api/generation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                voice: voice
            })
        });
        const resp = await req.json();
        if (resp.data === null) {
            console.log(`error: ${resp.error}`);
        } else {
            // Convert base64-encoded string to binary string
            const binaryString = Buffer.from(resp.data, 'base64').toString('binary');
            // Write binary string to file
            fs.writeFileSync('audio.mp3', binaryString, 'binary');
        };
    } catch {
        // idk why this is printing
        console.log('If the error code is 503, the service is currently unavailable. Please try again later.');
        console.log(`Voice: ${voice}`);
        console.log(`Text: ${text}`);
    };
};


(function () {
    checkAPI().then((res) => {
        if (res === 200) {
            synthesizeSpeech('Testing tiktok audio synthesizer', 'en_us_rocket');
        } else {
            console.log('API is unavailable, stopping');
        }
    });
})();