'use strict';
require('dotenv').load(); // bring in enviroment vars

var Twitter = require('twitter');
var twitter = new Twitter({
      consumer_key: process.env.TWITTER_API,
      consumer_secret: process.env.TWITTER_SECRET,
      access_token_key: process.env.TWITTER_ACCESSTOKEN,
      access_token_secret: process.env.TWITTER_TOKENSECRET
    });
var twitterText = require('twitter-text');

const getTweets = new Promise((resolve, reject) => {
  const options = {
    trim_user: true,
    exclude_replies: true,
    include_rts: false,
    screen_name: process.env.TWITTER_USERNAME
  };
  twitter.get('statuses/user_timeline', options, (error, tweets) => {
    if (error) {
      return reject(`Error: ${error}`);
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
          human: date.toDateString(),
          iso: date.toISOString()
        },
        text: {
          raw: tweet.text,
          html: twitterText.autoLink(twitterText.htmlEscape(tweet.text))
        },
        retweets: tweet.retweet_count,
        favourites: tweet.favorite_count
      };

      // if the tweet replies to someone add that too
      if (tweet.in_reply_to_screen_name) {
        processedTweet.replyingTo = tweet.in_reply_to_screen_name;
      }

      return processedTweet;
    });

    resolve(tweets);
  });
});

module.exports = getTweets;
