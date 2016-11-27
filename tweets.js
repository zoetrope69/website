require('dotenv').load(); // bring in enviroment vars
'use strict';

var Twitter = require('twitter');
var twitter = new Twitter({
      consumer_key: process.env.TWITTER_API,
      consumer_secret: process.env.TWITTER_SECRET,
      access_token_key: process.env.TWITTER_ACCESSTOKEN,
      access_token_secret: process.env.TWITTER_TOKENSECRET
    });

function processText(tweet) {
  let text = tweet.text;

  // replace urls with non t.co urls
  if (tweet.entities.urls.length > 0) {
    const urls = tweet.entities.urls;
    urls.forEach(url => {
      text = `${text.substring(0, url.indices[0])}${url.display_url}${text.substring(url.indices[1])}`;
    });
  }

  // remove any t.co urls
  text = text.replace(/https?:\/\/t\.co\/[\n\S]+/g, '');

  return text.trim();
}

function getTweets() {
  return new Promise((resolve, reject) => {
    const options = {
      trim_user: true,
      exclude_replies: true,
      include_rts: false,
      screen_name: process.env.TWITTER_USERNAME
    };
    twitter.get('statuses/user_timeline', options, (error, tweets) => {
      if (error) {
        return reject(error);
      }

      let user = tweets[0].user;
      user = {
        username: user.screen_name,
        followers: user.followers_count,
        following: user.friends_count,
        tweets: user.statuses_count,
        image: user.profile_image_url_https
      };

      tweets = tweets.map(tweet => {
        const date = new Date(tweet.created_at);
        const processedTweet = {
          time: {
            human: `${date.toDateString()} ${date.toLocaleTimeString('en-GB')}`,
            iso: date.toISOString()
          },
          text: processText(tweet),
          retweets: tweet.retweet_count,
          favourites: tweet.favorite_count,
          uri: `https://twitter.com/zaccolley/status/${tweet.id}`
        };

        if (tweet.extended_entities) {
          if (tweet.extended_entities.media[0].type = 'photo') {
            processedTweet.images = tweet.extended_entities.media.map(image => {
              return { uri: `${image.media_url_https}:thumb` };
            });
          }
        }

        // if the tweet replies to someone add that too
        if (tweet.in_reply_to_screen_name) {
          processedTweet.replyingTo = tweet.in_reply_to_screen_name;
        }

        return processedTweet;
      });

      resolve(tweets);
    });
  });
}

module.exports = getTweets;
