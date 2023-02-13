require('dotenv').config();
const puppeteer = require('puppeteer');
const tts = require('./tts-generator');
const fs = require('fs');

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
        const targetComment1 = `https://www.reddit.com${results[0].comments[0].permalink}`;
        const targetComment2 = `https://www.reddit.com${results[0].comments[1].permalink}`;
        const targetComment3 = `https://www.reddit.com${results[0].comments[2].permalink}`;

        await takeMultipleScreenshots([targetURL, targetComment1, targetComment2, targetComment3]);



        // await tts.downloadAudioFromText(results[0].post.title);


        return results;

    } catch (error) {
        console.error(error);
        return [];
    }

}

async function takeMultipleScreenshots(urls) {
    // Toggle headless mode to see the browser in action
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Emulate a mobile device - depreciated function pls fix :(
    await page.emulate(puppeteer.devices['iPhone X']);

    // Enable dark mode by setting the 'prefers-color-scheme' preference
    await page.emulateMediaFeatures([
        { name: 'prefers-color-scheme', value: 'dark' },
    ]);


    let clip;
    for (const url of urls) {
        console.log(`Attempting to screenshot: ${url}`);
        await page.goto(url, {
            waitUntil: "networkidle2",
        });
        // wait for network to be idle for 2 seconds before taking screenshot

        clip = await page.evaluate((url, urls) => {
            // remove the 'view in app' prompt
            const blockers = document.getElementsByTagName('shreddit-experience-tree');
            if (blockers.length) {
                console.log('Removing shreddit-experience-tree elements');
                for (const blocker of blockers) {
                    blocker.remove();
                }
            };
            // remove the ad at the bottom of the page
            const ad = document.getElementsByTagName('shreddit-comments-page-ad');
            if (ad.length) {
                console.log('Removing shreddit-comments-page-ad elements');
                for (const blocker of ad) {
                    blocker.remove();
                }
            };

            if (urls.indexOf(url) === 0) {
                // if the first url, take a screenshot of the post
                const target = document.getElementsByTagName('shreddit-post')[0].getBoundingClientRect();

                if (target) {
                    return {
                        x: target.x,
                        y: target.y,
                        width: target.width,
                        height: target.height
                    };
                } else {
                    return {
                        x: 0,
                        y: 60,
                        width: 375,
                        height: 210
                    };
                };
            } else {
                // after the first url, take a screenshot of the comment
                const comment = document.getElementsByTagName('shreddit-comment')[0].getBoundingClientRect();
                // get the dimensions of the element with the ID ''-post-rtjson-content'
                const body = document.getElementById('-post-rtjson-content').getBoundingClientRect();
                if (comment) {
                    return {
                        x: 0,
                        y: 385,
                        width: 375,
                        height: body.height + 85
                    };
                } else {
                    return {
                        x: 0,
                        y: 385,
                        width: 375,
                        height: 210
                    };
                };
            };
        }, url, urls);

        // wait for 40 seconds
        // await page.waitFor(40000);

        await page.screenshot({ path: `screenshot-${urls.indexOf(url)}.png`, clip });
        console.log(`Successfully downloaded screenshot from: ${url}`);
    };

    await browser.close();
};


module.exports = { getTopPosts };





/*

AskReddit: Title but no body text, no images, need to get comments

TODO:
add a way to change process based on target subreddit
TTS library that generates sound files from text
make youtube API get background footage then download that background footage 
video editing library to bring it all together


TikTok TTS

reddit api call sometime fails for seemingly no reason

optimize the screenshot function / clean it up
sometimes getting the rect fails

*/