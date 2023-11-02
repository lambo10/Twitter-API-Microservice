const express = require('express');
const axios = require('axios');
const app = express();
const port = 443;
let testOpenVariable = 0;

app.use(express.json());

app.post('/fetch-comments', async (req, res) => {
  const { tweetId, hashtag } = req.body;
  try {
    const response = await axios.get(`https://api.twitter.com/2/tweets/${tweetId}/comments`, {
      headers: {
        'Authorization': `Bearer YOUR_TWITTER_BEARER_TOKEN`
      }
    });
    const comments = response.data.data.filter(comment => comment.text.includes(hashtag));
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/', (req, res) => {
  res.send('OK'+testOpenVariable);
});

// add a function that executes a function continuously even if requests are not made
// this is to prevent the function from going to sleep
setInterval(() => {
  testOpenVariable++;
}, 3000);

app.listen(port, () => {
  console.log(`Twitter API Microservice listening at http://localhost:${port}`);
});
