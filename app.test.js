
const supertest = require('supertest');
const axios = require('axios');
const app = require('./app'); // This is where you'd export your Express app

jest.mock('axios'); // Mock axios to prevent actual HTTP requests

describe('Test /fetch-comments endpoint', () => {
  test('It should fetch comments with the specified hashtag', async () => {
    const tweetId = '123';
    const hashtag = '#example';

    // Mock the axios.get response
    axios.get.mockResolvedValue({
      data: {
        data: [
          { text: 'This is a comment with #example' },
          { text: 'This is another comment with #example' },
          { text: 'This comment does not have the hashtag' },
        ],
      },
    });

    // Use supertest to test the endpoint
    const response = await supertest(app)
      .post('/fetch-comments')
      .send({ tweetId, hashtag });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      { text: 'This is a comment with #example' },
      { text: 'This is another comment with #example' },
    ]);
    expect(axios.get).toHaveBeenCalledWith(`https://api.twitter.com/2/tweets/${tweetId}/comments`, {
      headers: {
        'Authorization': `Bearer YOUR_TWITTER_BEARER_TOKEN`
      },
    });
  });

  test('It should handle errors', async () => {
    const tweetId = '123';
    const hashtag = '#example';

    // Mock the axios.get to simulate an error
    axios.get.mockRejectedValue(new Error('Network Error'));

    const response = await supertest(app)
      .post('/fetch-comments')
      .send({ tweetId, hashtag });

    expect(response.statusCode).toBe(500);
    expect(response.text).toBe('Internal Server Error');
  });
});
