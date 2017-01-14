'use strict'
require('dotenv').load() // bring in enviroment vars

const request = require('request')

const trakttvUrl = 'https://api.trakt.tv'
const omdbUrl = 'http://www.omdbapi.com/'

function checkRequest (error, response) {
  if (error) {
    return error
  }

  if (response.statusCode !== 200) {
    return `Error: Response was not OK`
  }

  return false
}

function processShows (shows) {
  return shows.map(item => {
    const date = new Date(item.watched_at)
    return {
      time: {
        human: date.toDateString(),
        iso: date.toISOString()
      },
      title: item.episode.title,
      number: item.episode.number,
      season: item.episode.season,
      show: item.show.title,
      year: item.show.year
    }
  })
}

function getPoster (imdbId, callback) {
  const url = `${omdbUrl}?i=${imdbId}&type=series&plot=short&r=json`
  return request({ url, timeout: +process.env.REQUEST_TIMEOUT }, (error, response, body) => {
    // check if the result is good to process
    const requestCheck = checkRequest(error, response)
    if (requestCheck) {
      return callback({ error: 'Something went wrong' })
    }

    const data = JSON.parse(body)

    if (!data.Poster) {
      return callback({ error: 'Couldnt find a poster image' })
    }

    return callback(null, data.Poster)
  })
}

function getWatchedShows () {
  return new Promise(resolve => {
    const url = trakttvUrl + `/users/${process.env.TRAKTTV_USERNAME}/history/episodes?extended=full`
    const headers = {
      'Content-Type': 'application/json',
      'trakt-api-version': 2,
      'trakt-api-key': process.env.TRAKTTV_CLIENT_ID
    }

    return request({ url, headers, timeout: +process.env.REQUEST_TIMEOUT }, (error, response, body) => {
      // check if the result is good to process
      const requestCheck = checkRequest(error, response)
      if (requestCheck) {
        return resolve({ error: 'Something went wrong' })
      }

      const data = JSON.parse(body)

      if (data.length <= 0) {
        return resolve({ error: 'No shows' })
      }

      const shows = processShows(data)

      getPoster(data[0].episode.ids.imdb, (err, image) => {
        if (err) {
          console.error(err.error)
          return resolve(shows)
        }

        if (!image) {
          return resolve(shows)
        }

        shows[0].image = image

        return resolve(shows)
      })
    })
  })
}

module.exports = getWatchedShows
