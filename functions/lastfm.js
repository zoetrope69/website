require('dotenv').config();

if (!process.env.LASTFM_API_KEY) {
  console.error('❗ Failed to load in the LASTFM_API_KEY. Is it missing from the `.env` file?');
  process.exit();
}

const fetch = require('node-fetch');
const {
  humanisedList
} = require('./helpers');
const {
  LASTFM_API_KEY
} = process.env;
const LASTFM_USERNAME = 'zaccolley';

const createLastFMURL = `https://ws.audioscrobbler.com/2.0/?method=user.getweeklyartistchart&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json`

async function getLastFMArtists() {
  const results = await fetch(createLastFMURL)
    .then(response => response.json())
    .catch(console.error)

  if (
    !results.weeklyartistchart ||
    !results.weeklyartistchart.artist ||
    results.weeklyartistchart.artist.length === 0
  ) {
    console.error('No artists found');
    return [];
  }

  const artists = results.weeklyartistchart.artist;
  const artistNames = artists.map(artist => artist.name);

  const firstFiveArtists = artistNames.slice(0, 5);

  return humanisedList(firstFiveArtists);
}

module.exports = getLastFMArtists;