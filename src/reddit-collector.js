require('dotenv').config();
const puppeteer = require('puppeteer');
const tts = require('./tts-generator');

const CLIENT_SECRET = process.env.CLIENT_SECRET; // Reddit app's client secret
const CLIENT_ID = process.env.CLIENT_ID; // Reddit app's client ID

const REDDIT_EMAIL = process.env.REDDIT_EMAIL;
const USER_AGENT = `TikTokGenerator/1.0 (http://localhost:8888; ${REDDIT_EMAIL})`; // string that identifies your app or script



const getTopPosts = async () => {

    const subreddit = 'AskReddit';

    const endpoint = `https://www.reddit.com/r/${subreddit}/top.json?t=week`;

    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        const topPosts = data.data.children.map(post => post.data);

        const postPromises = topPosts.map(async post => {
            const commentsEndpoint = `https://www.reddit.com/r/${subreddit}/comments/${post.id}.json`;
            const commentsResponse = await fetch(commentsEndpoint);
            const commentsData = await commentsResponse.json();
            const comments = commentsData[1].data.children.map(comment => comment.data);
            return { post, comments };
        });

        const results = await Promise.all(postPromises);

        console.log('Post content collected');

        const targetURL = `https://www.reddit.com${results[0].post.permalink}`;

        console.log(`Attempting to screenshot: ${targetURL}`);

        await takeMultipleScreenshots([targetURL]);



        await tts.downloadAudioFromText(results[0].post.title);


        return results;

    } catch (error) {
        console.error(error);
        return [];
    }

}

async function takeMultipleScreenshots(urls) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Emulate a mobile device - depreciated function pls fix :(
    await page.emulate(puppeteer.devices['iPhone X']);

    // Enable dark mode by setting the 'prefers-color-scheme' preference
    await page.emulateMediaFeatures([
        { name: 'prefers-color-scheme', value: 'dark' },
    ]);

    // Define the portion of the screen to capture
    // iPhone X: 1125px x 2436px
    // how can I change the screenshot clip dimensions based on the size of the post?
    // sometimes the screenshots are dark because a 'view in app' prompt shows up on mobile browser
    const clip = {
        x: 0,
        y: 60,
        width: 375,
        height: 210
    };

    for (const url of urls) {
        await page.goto(url);
        const safeFileName = url.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        await page.screenshot({ path: `screenshot-${safeFileName}.png`, clip });
        console.log(`Successfully downloaded screenshot from: ${url}`);
    }

    await browser.close();
}



module.exports = { getTopPosts };





/*

AskReddit: Title but no body text, no images, need to get comments

TODO:
add a way to change process based on target subreddit
TTS library that generates sound files from text
make youtube API get background footage then download that background footage 
video editing library to bring it all together


TikTok TTS

*/