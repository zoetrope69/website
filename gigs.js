'use strict'
require('dotenv').load() // bring in enviroment vars

const request = require('request')

const songkickUrl = `http://api.songkick.com/api/3.0/users/${process.env.SONGKICK_USERNAME}`

function checkRequest (error, response) {
  if (error) {
    return error
  }

  if (response.statusCode !== 200) {
    return `Error: Response was not OK`
  }

  return false
}

function processPerformances (performances) {
  const p = performances.map(p => p.displayName)
  return [
    p.slice(0, -1).join(', '),
    p.slice(-1)[0]
  ].join(p.length < 2 ? '' : ' and ')
}

function processGig (gig, timeframe) {
  // determine any attendance to gig
  let attendance = false
  if (gig.reason) {
    attendance = gig.reason.attendance
    gig = gig.event
  }

  const image = `https://images.sk-static.com/images/media/profile_images/artists/${gig.performance[0].artist.id}/avatar`

  const date = new Date(`${gig.start.date} ${gig.start.time ? gig.start.time : ''}`.trim())
  gig = {
    time: {
      tense: timeframe,
      human: `${date.toDateString()} ${date.toLocaleTimeString('en-GB')}`,
      iso: date.toISOString()
    },
    artists: processPerformances(gig.performance),
    venue: gig.venue.displayName,
    type: gig.type.toLowerCase(),
    image,
    uri: gig.uri
  }

  // add attendance if relevant
  if (attendance) {
    gig.attendance = attendance
  }

  return gig
}

function getPastGigs () {
  return new Promise(resolve => {
    const order = 'desc'
    const url = songkickUrl + '/gigography.json' +
                '?apikey=' + process.env.SONGKICK_API +
                '&order=' + order

    return request(url, (error, response, body) => {
      // check if the result is good to process
      const requestCheck = checkRequest(error, response)
      if (requestCheck) {
        return resolve({ error })
      }

      const data = JSON.parse(body)

      let gigs = data.resultsPage.results.event

      // process and strip out what we need from gig
      gigs = gigs.map(gig => processGig(gig, 'past'))

      resolve(gigs)
    })
  })
}

module.exports = getPastGigs
