'use strict';
require('dotenv').load(); // bring in enviroment vars

var request = require("request");

const getCode = new Promise((resolve, reject) => {
  request({
    method: 'GET',
    url: `https://api.github.com/users/${process.env.GITHUB_USERNAME}/events/public`,
    headers: {
      'User-Agent': 'zaccolley.com',
      'Authorization': `Basic ${process.env.GITHUB_BASIC_AUTH}`
    }
  }, function (error, response, body) {
    if (error) {
      return reject(`Error: ${error}`);
    }

    if (response.statusCode !== 200) {
      return reject(`Error: Response not OK`);
    }

    const rate = {
      limit: response.headers['x-ratelimit-limit'],
      remaining: response.headers['x-ratelimit-remaining'],
      reset: response.headers['x-ratelimit-reset']
    };

    if (rate.remaining <= 0) {
      return reject(`Error: Ran out of requests`);
    }

    let events = JSON.parse(body);

    var eventTypes = [
      'CommitCommentEvent',
      'CreateEvent',
      'IssueCommentEvent',
      'IssuesEvent',
      'PublicEvent',
      'PullRequestEvent',
      'PullRequestReviewCommentEvent',
      'PushEvent',
      'RepositoryEvent'
    ];

    // filter out only the events we want
    events = events.filter(event => eventTypes.indexOf(event.type) !== -1);

    events = events.map((event, i) => {
      const output = {
        time: event.created_at,
        repo: event.repo
      };

      switch (event.type) {
        case 'CreateEvent':
          output.type = 'create';
          break;
        case 'IssueCommentEvent':
          output.type = 'create';
          output.comment = output.payload;
          break;
        case 'IssuesEvent':
          output.type = 'issues';
          output.issue = event.payload;
          break;
        case 'PublicEvent':
          output.type = 'public';
          break;
        case 'PullRequestEvent':
          output.type = 'pullrequest';
          output.pr = event.payload;
          break;
        case 'PullRequestReviewCommentEvent':
          output.type = 'create';
          output.comment = output.payload;
          break;
        case 'PushEvent':
          output.type = 'push';
          output.commits = event.payload.commits.map(commit => ({ message: commit.message, uri: commit.url }));
          break;
      }

      return output;
    });

    resolve(events);
  });
});

module.exports = getCode;
