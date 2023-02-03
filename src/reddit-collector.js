require('dotenv').config();

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


const getTopPosts = async () => {

    const subreddit = 'AskReddit'; // subreddit you want to retrieve posts from
    const limit = 10; // number of posts you want to retrieve
    const timeframe = 'week' //timeframe of results

    // Send a request to the Reddit API
    const headers = new Headers({
        "User-Agent": USER_AGENT
    });
    fetch(`https://www.reddit.com/r/${subreddit}/top.json?t=${timeframe}limit=${limit}`, { headers })
        .then(res => res.json())
        .then(data => {
            const posts = data.data.children;

            // Print the titles and self-texts of the posts
            posts.forEach(function (post) {
                const title = post.data.title;
                const selftext = post.data.selftext;
                console.log("Title:", title);
                console.log("Self-text:", selftext, "\n");
            });
        })
        .catch(err => console.error(err));

};

// how could I get a screenshot of the reddit post
// could I follow a link to it?
// Puppeteer


module.exports = { getTopPosts };



/*

AskReddit: Title but no body text, no images, need to get comments

*/