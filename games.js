'use strict'
require('dotenv').load() // bring in enviroment vars

const request = require('request')

const steamUrl = 'http://api.steampowered.com'

function checkRequest (error, response) {
  if (error) {
    return error
  }

  if (response.statusCode !== 200) {
    return `Error: Response was not OK`
  }

  return false
}

function minutesToHours (minutes) {
  return Math.round((minutes / 60) * 10) / 10
}

function processGames (games) {
  return games.map(item => {
    const output = {
      id: +item.appid,
      name: item.name,
      playtime: {
        allTime: minutesToHours(item.playtime_forever)
      },
      image: `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/${item.appid}/${item.img_icon_url}.jpg`
    }

    if (item.playtime_2weeks) {
      output.playtime.twoWeeks = minutesToHours(item.playtime_2weeks)
    }

    return output
  })
}

function getPlayerSummary () {
  return new Promise(resolve => {
    const url = `${steamUrl}/ISteamUser/GetPlayerSummaries/v0002/` +
                `?key=${process.env.STEAM_API}` +
                `&steamids=${process.env.STEAM_USER_ID}` +
                '&format=json'

    return request({ url, timeout: +process.env.REQUEST_TIMEOUT }, (error, response, body) => {
      // check if the result is good to process
      const requestCheck = checkRequest(error, response)
      if (requestCheck) {
        return resolve({ error: 'Something went wrong' })
      }

      const data = JSON.parse(body)

      if (data.response.players.length <= 0) {
        return resolve({ error: 'No player found' })
      }

      const player = data.response.players[0]

      if (!player.gameid) {
        return resolve(false)
      }

      return resolve(+player.gameid)
    })
  })
}

function getAllGames () {
  return new Promise(resolve => {
    const url = `${steamUrl}/IPlayerService/GetOwnedGames/v0001/` +
                `?key=${process.env.STEAM_API}` +
                `&steamid=${process.env.STEAM_USER_ID}` +
                '&include_appinfo=1' +
                '&include_played_free_games=1' +
                '&format=json'

    return request({ url, timeout: +process.env.REQUEST_TIMEOUT }, (error, response, body) => {
      // check if the result is good to process
      const requestCheck = checkRequest(error, response)
      if (requestCheck) {
        return resolve({ error: 'Something went wrong' })
      }

      const data = JSON.parse(body)

      if (data.response.games.length <= 0) {
        return resolve({ error: 'No games' })
      }

      const games = processGames(data.response.games)

      return resolve(games)
    })
  })
}

function getRecentlyPlayedGames () {
  return new Promise(resolve => {
    const url = `${steamUrl}/IPlayerService/GetRecentlyPlayedGames/v0001/` +
                `?key=${process.env.STEAM_API}` +
                `&steamid=${process.env.STEAM_USER_ID}` +
                '&format=json'

    return request({ url, timeout: +process.env.REQUEST_TIMEOUT }, (error, response, body) => {
      // check if the result is good to process
      const requestCheck = checkRequest(error, response)
      if (requestCheck) {
        return resolve({ error: 'Something went wrong' })
      }

      const data = JSON.parse(body)

      if (!data || data.response.total_count <= 0 || data.response.games.length <= 0) {
        return resolve({ error: 'No games' })
      }

      const games = processGames(data.response.games)

      return resolve(games)
    })
  })
}

function getLatestGame () {
  return new Promise(resolve => {
    getAllGames().then(games => {
      getPlayerSummary().then(gameId => {
        if (!gameId) {
          return resolve(getRecentlyPlayedGames())
        }

        const game = games.find(game => game.id === gameId)
        game.playing = true
        return resolve([game])
      })
    })
  })
}

module.exports = getLatestGame
