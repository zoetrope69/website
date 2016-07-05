'use strict';
require('dotenv').load(); // bring in enviroment vars

var LastFmNode = require('lastfm').LastFmNode;
var lastfm = new LastFmNode({
  api_key: process.env.LASTFM_API, // sign-up for a key at http://www.last.fm/api
  secret:  process.env.LASTFM_SECRET,
  useragent: process.env.LASTFM_USERAGENT
});
var username = process.env.LASTFM_USERNAME;

const favArtist = new Promise ((resolve, reject) => {
  var periods = ['overall', '7day', '1month', '3month', '6month', '12month']; // different periods

  var recentTracks = lastfm.request('user.gettopartists', {
    username,
    period: periods[1],
    limit: 1
  });

  // if there's any errors reject right away
  recentTracks.on('error', (error) =>
    reject(`Error (${error.error}): ${error.message}`));

  recentTracks.on('success', (data) => {
    // if there is no artist found reject
  	if (data.topartists.artist.length > 0
        && typeof data.topartists.artist[0] === 'undefined') {
      return reject("Error: Couldn't find a artist");
    }

    let artist = data.topartists.artist[0];

    // strip out the data we need
    artist = {
    	name: artist.name,
      url: artist.url,
      plays: artist.playcount
    };

    return resolve(artist);
  });
});

function processTrack(data) {
  // if there's an image grab it here
  let image = false;
  if (data.hasOwnProperty('image') && data.image[3]['#text'] !== '') {
    image = data.image[3]['#text'];
  }

  // is the data being played?
  let playing = false;
  if (typeof data['@attr'] !== 'undefined') {
    playing = data['@attr'].nowplaying;
  }

  // handle the time this track was played
  let time = +new Date() / 1000;
  if (!playing) {
    time = time - data.date.uts;
  }

  // simplify response
  const track = {
    time,
    playing,

    name: data.name,
    artist: data.artist['#text'],
    album: data.album['#text'],
  };

  // if there's an image add it here
  if (image) {
    track.image = image;
  }

  return track;
}

const getRecentTracks = (limit) => new Promise ((resolve, reject) => {
  const recentTracks = lastfm.request('user.getrecenttracks', {
    username,
    limit
  });

  recentTracks.on('error', (error) =>
    reject(`Error (${error.error}): ${error.message}`));

  recentTracks.on('success', (data) => {

    // if there are no tracks then reject
    if (data.recenttracks.track.length > 0
        && typeof data.recenttracks.track === 'undefined') {
      return reject(`Error: Couldn't find any tracks`);
    }

    const tracks = data.recenttracks.track.map(processTrack);

    resolve(tracks);
  });
});

const getMusic = new Promise ((resolve, reject) => {
  Promise.all([getRecentTracks(10), favArtist]).then((result) => {
    return resolve({
      tracks: result[0],
      favArtist: result[1]
    });
  }, reject);
});

// getMusic.then(music => console.log('music', music));

module.exports = getMusic;
