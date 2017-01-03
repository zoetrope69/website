'use strict'
require('dotenv').load() // bring in enviroment vars

const request = require('request')

const youtubeUrl = `https://www.googleapis.com/youtube/v3/playlistItems?key=${process.env.YOUTUBE_API}`

function checkRequest (error, response) {
  if (error) {
    return error
  }

  if (response.statusCode !== 200) {
    return `Error: Response was not OK`
  }

  return false
}

function processVids (vids) {
  vids = vids.map(vid => {
    const data = vid.snippet
    const date = new Date(data.publishedAt)
    return {
      time: {
        human: `${date.toDateString()} ${date.toLocaleTimeString('en-GB')}`,
        iso: date.toISOString()
      },
      title: data.title,
      image: data.thumbnails.default.url,
      uri: `https://www.youtube.com/watch?v=${data.resourceId.videoId}`
    }
  })
  return vids
}

function getLikedVids () {
  return new Promise(resolve => {
    const maxResults = 10
    const url = youtubeUrl + `&playlistId=${process.env.YOUTUBE_PLAYLIST_ID}` +
                '&part=snippet' +
                '&maxResults=' + maxResults

    return request({ url, timeout: +process.env.REQUEST_TIMEOUT }, (error, response, body) => {
      // check if the result is good to process
      const requestCheck = checkRequest(error, response)
      if (requestCheck) {
        return resolve({ error: 'Something went wrong' })
      }

      const data = JSON.parse(body)

      if (data.items.length <= 0) {
        return resolve({ error: 'No vids' })
      }

      const vids = processVids(data.items)

      resolve(vids)
    })
  })
}

getLikedVids()

module.exports = getLikedVids
