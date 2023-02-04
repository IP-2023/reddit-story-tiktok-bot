require('dotenv').config();
const AWS = require('aws-sdk');
const fs = require('fs');

const POLLY_ACCESS_KEY = process.env.POLLY_ACCESS_KEY;
const POLLY_SECRET = process.env.POLLY_SECRET;


const downloadAudioFromText = async (text) => {

    // Configure the AWS SDK with your AWS credentials and region
    AWS.config.update({
        accessKeyId: POLLY_ACCESS_KEY,
        secretAccessKey: POLLY_SECRET,
        region: 'us-east-2',
    });

    // Create an instance of the Amazon Polly client
    const polly = new AWS.Polly();

    // Define the Amazon Polly parameters
    const params = {
        OutputFormat: 'mp3',
        Text: text,
        VoiceId: 'Joanna',
    };

    // Call the Amazon Polly service to synthesize speech
    polly.synthesizeSpeech(params, (err, data) => {
        if (err) {
            console.error(err);
        } else {
            // Write the TTS audio stream to a file
            fs.writeFileSync('output.mp3', data.AudioStream, 'binary');
            console.log('TTS audio file written to output.mp3');
        }
    });


};



module.exports = { downloadAudioFromText };