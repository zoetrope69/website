'use strict';
require('dotenv').load(); // bring in enviroment vars

var request = require('request');

function processTrack(data) {
  // if there's an image grab it here
  let image = false;
  if (data.hasOwnProperty('image') && data.image[1]['#text'] !== '') {
    image = data.image[1]['#text'];
  }

  // is the data being played?
  let playing = false;
  if (typeof data['@attr'] !== 'undefined') {
    playing = data['@attr'].nowplaying;
  }

  // handle the time this track was played
  let date = new Date();
  if (!playing) {
    date = new Date(data.date.uts * 1000);
  }

  // simplify response
  const track = {
    time: {
      human: `${date.toDateString()} ${date.toLocaleTimeString('en-GB')}`,
      iso: date.toISOString()
    },
    playing,
    name: data.name,
    artist: data.artist['#text'],
    album: data.album['#text'],
    uri: data.url,
    image
  };

  // if there's an image add it here
  if (image) {
    track.image = image;
  }

  return track;
}

function checkRequest(error, response) {
  if (error) {
    return error;
  }

  if (response.statusCode !== 200) {
    return `Error: Response was not OK`;
  }

  return false;
}

function getRecentTracks(limit = 1) {
  return new Promise ((resolve, reject) => {
    const url = 'https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks' +
                '&user=' + process.env.LASTFM_USERNAME +
                '&api_key=' + process.env.LASTFM_API +
                '&limit=' + limit +
                '&format=json';

    return request(url, (error, response, body) => {
      // check if the result is good to process
      const requestCheck = checkRequest(error, response);
      if (requestCheck) {
        return reject(requestCheck);
      }

      const data = JSON.parse(body);

      // if there are no tracks then reject
      if (data.recenttracks.track.length > 0
          && typeof data.recenttracks.track === 'undefined') {
        return reject("Couldn't find any tracks");
      }

      const tracks = data.recenttracks.track.map(processTrack);

      resolve(tracks);
    });
  });
}

module.exports = getRecentTracks;
