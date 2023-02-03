require('dotenv').config();
const puppeteer = require('puppeteer');

const CLIENT_SECRET = process.env.CLIENT_SECRET; // Reddit app's client secret
const CLIENT_ID = process.env.CLIENT_ID; // Reddit app's client ID

const REDDIT_EMAIL = process.env.REDDIT_EMAIL;
const USER_AGENT = `TikTokGenerator/1.0 (http://localhost:8888; ${REDDIT_EMAIL})`; // string that identifies your app or script

// fetch("https://www.reddit.com/api/v1/access_token", {
//     method: "POST",
//     headers: {
//         "User-Agent": USER_AGENT,
//         "Content-Type": "application/x-www-form-urlencoded"
//     },
//     body: "grant_type=client_credentials",
//     auth: `${CLIENT_ID}:${CLIENT_SECRET}`
// })
//     .then(res => res.json())
//     .then(data => {
//         const accessToken = data.access_token;
//         console.log(`Access token: ${accessToken}`);
//     })
//     .catch(err => console.error(err));


// const getTopPosts = async () => {

//     const subreddit = 'AskReddit'; // subreddit you want to retrieve posts from
//     const limit = 10; // number of posts you want to retrieve
//     const timeframe = 'week' //timeframe of results

//     // Send a request to the Reddit API
//     const headers = new Headers({
//         "User-Agent": USER_AGENT
//     });
//     fetch(`https://www.reddit.com/r/${subreddit}/top.json?t=${timeframe}limit=${limit}`, { headers })
//         .then(res => res.json())
//         .then(data => {
//             const posts = data.data.children;

//             // Print the titles and self-texts of the posts
//             posts.forEach(function (post) {
//                 const title = post.data.title;
//                 const selftext = post.data.selftext;
//                 console.log("Title:", title);
//                 console.log("Self-text:", selftext, "\n");
//             });
//         })
//         .catch(err => console.error(err));

// };

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

        return results;

    } catch (error) {
        console.error(error);
        return [];
    }

}

async function takeMultipleScreenshots(urls) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    for (const url of urls) {
        await page.goto(url);
        const safeFileName = url.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        await page.screenshot({ path: `screenshot-${safeFileName}.png` });
        console.log(`Succesfully downloaded screenshot from: ${url}`);
    }

    await browser.close();
}

// takeMultipleScreenshots(['https://www.example1.com', 'https://www.example2.com']);





module.exports = { getTopPosts };





/*

AskReddit: Title but no body text, no images, need to get comments

*/