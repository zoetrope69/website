'use strict'
require('dotenv').load() // bring in enviroment vars

const request = require('request')
let rememberUserToken = ''
let podcasts = []

function login (email, password) {
  return new Promise(resolve => {
    request({
      method: 'POST',
      uri: 'https://play.pocketcasts.com/users/sign_in',
      formData: {
        'user[email]': email,
        'user[password]': password,
        'user[remember_me]': 1
      },
      timeout: +process.env.REQUEST_TIMEOUT
    }, (error, response, body) => {
      if (error) {
        return resolve({ error })
      }

      // redirect to play.
      if (response.statusCode !== 302) {
        return resolve({ error: 'Expected status code to be 302' })
      }

      if (body.includes('email or password is incorrect')) {
        return resolve({ error: 'Email or password is incorrect' })
      }

      const cookies = response.headers['set-cookie']

      const rememberUserTokenString = cookies[1]

      if (!rememberUserTokenString.includes('remember_user_token=')) {
        return resolve({ error: 'Couldnt find remember user token' })
      }

      const rememberUserTokenStartIndex = 'remember_user_token='.length
      const rememberUserTokenEndIndex = rememberUserTokenString.indexOf('; path=/')

      const rememberUserToken = rememberUserTokenString.slice(rememberUserTokenStartIndex, rememberUserTokenEndIndex)

      resolve(rememberUserToken)
    })
  })
}

function requestJSON (path) {
  return new Promise(resolve => {
    request({
      method: 'POST',
      url: `https://play.pocketcasts.com/web${path}`,
      headers: {
        cookie: `remember_user_token=${rememberUserToken};`,
        'content-type': 'application/json'
      },
      body: '{}',
      timeout: +process.env.REQUEST_TIMEOUT
    }, (error, response, body) => {
      if (error) {
        getData()
        return resolve({ error })
      }

      if (response.statusCode !== 200) {
        getData()
        return resolve({ error: `Expected status code to be 200. (${response.statusCode})` })
      }

      const data = JSON.parse(body)

      resolve(data)
    })
  })
}

function getPodcastList () {
  return requestJSON('/podcasts/all.json').then(data => data.podcasts)
}

function getNewReleases () {
  return requestJSON('/episodes/new_releases_episodes.json').then(data => data.episodes)
}

function processEpisodes (data) {
  const EPISODE_PLAYING_STATUS = {
    1: 'Not played',
    2: 'In progress',
    3: 'Finished',
    4: 'Old'
  }

  return data.episodes.map(episode => {
    const podcast = podcasts.find(podcast => podcast.uuid === episode.podcast_uuid)

    return {
      title: podcast.title,
      episode: episode.title,
      description: podcast.description,
      percentage: episode.played_up_to > 0 ? Math.floor((episode.played_up_to / episode.duration) * 100) : 0,
      status: EPISODE_PLAYING_STATUS[episode.playing_status],
      image: podcast.thumbnail_url,
      uri: podcast.url
    }
  })
}

function getInProgress () {
  return requestJSON('/episodes/in_progress_episodes.json').then(processEpisodes)
}

function getData () {
  login(process.env.POCKETCASTS_EMAIL, process.env.POCKETCASTS_PASSWORD).then(token => {
    rememberUserToken = token
    getPodcastList().then(data => {
      podcasts = data
    })
  })
}

// login and grab data
getData()

module.exports = getInProgress
