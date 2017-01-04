'use strict'
require('dotenv').load() // bring in enviroment vars

const request = require('request')

const foursquareUrl = `https://api.foursquare.com/v2/users/${process.env.FOURSQUARE_USER_ID}/checkins?oauth_token=${process.env.FOURSQUARE_TOKEN}&v=${process.env.FOURSQUARE_VERSION_DATE}`

function checkRequest (error, response) {
  if (error) {
    return error
  }

  if (response.statusCode !== 200) {
    return `Error: Response was not OK`
  }

  return false
}

function processLocation (location) {
  const date = new Date(location.createdAt * 1000)

  const output = {
    time: {
      human: `${date.toDateString()} ${date.toLocaleTimeString('en-GB')}`,
      iso: date.toISOString()
    },
    name: location.venue.name,
    lat: location.venue.location.lat,
    lng: location.venue.location.lng,
    city: location.venue.location.city,
    state: location.venue.location.state,
    country: location.venue.location.country,
    cc: location.venue.location.cc
  }

  output.uri = `http://maps.google.com/?ll=${output.lat},${output.lng}`

  if (location.venue.categories) {
    const category = location.venue.categories[0]
    const icon = category.icon
    const iconSize = 88
    output.category = {
      name: category.name,
      colour: `hsl(${Math.floor(Math.random() * 360)}, 61%, 48%)`,
      image: `${icon.prefix}${iconSize}${icon.suffix}`
    }
  }

  if (location.shout) {
    output.info = location.shout
  }

  return output
}

function getLocations () {
  return new Promise(resolve => {
    const url = foursquareUrl
    return request({ url, timeout: +process.env.REQUEST_TIMEOUT }, (error, response, body) => {
      // check if the result is good to processs
      const requestCheck = checkRequest(error, response)
      if (requestCheck) {
        return resolve({ error: 'Something went wrong' })
      }

      const data = JSON.parse(body)

      if (!data.response || data.response.checkins.count === 0) {
        return resolve({ error: 'Couldn\'t find any checkins' })
      }

      let locations = data.response.checkins.items

      locations = locations.map(processLocation)

      resolve(locations)
    })
  })
}

module.exports = getLocations
