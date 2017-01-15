'use strict'
require('dotenv').load() // bring in enviroment vars

const request = require('request')

const jawboneUrl = `https://jawbone.com/nudge/api/v.1.1/users/@me/`

function checkRequest (error, response) {
  if (error) {
    return error
  }

  if (response.statusCode !== 200) {
    return `Error: Response was not OK`
  }

  return false
}

function getDate (date) {
  const dateString = '' + date
  const day = dateString.substr(6, 2)
  const month = dateString.substr(4, 2)
  const year = dateString.substr(0, 4)
  return new Date(`${month}-${day}-${year}`)
}

function processHeartrate (heartrate) {
  return heartrate.filter(item => item.resting_heartrate).map(item => {
    const date = getDate(item.date)

    return {
      time: {
        human: date.toDateString(),
        iso: date.toISOString()
      },
      beats: {
        perMinute: item.resting_heartrate,
        perSecond: item.resting_heartrate / 60
      }
    }
  })
}

function getRestingHeartrate () {
  return new Promise(resolve => {
    const url = jawboneUrl + 'heartrates'
    const headers = { 'Authorization': `Bearer ${process.env.JAWBONE_TOKEN}` }

    return request({ url, headers, timeout: +process.env.REQUEST_TIMEOUT }, (error, response, body) => {
      // check if the result is good to process
      const requestCheck = checkRequest(error, response)
      if (requestCheck) {
        return resolve({ error: 'Something went wrong' })
      }

      const json = JSON.parse(body)

      if (json.data && json.data.items.length <= 0) {
        return resolve({ error: 'No heartrate data' })
      }

      const heartrate = processHeartrate(json.data.items)

      resolve(heartrate)
    })
  })
}

function processSleeps (sleeps) {
  return sleeps.map(item => {
    const date = getDate(item.date)
    const formattedDuration = item.title.replace('for ', '').replace('h', ' hours and').replace('m', ' minutes')

    return {
      time: {
        human: date.toDateString(),
        iso: date.toISOString()
      },
      duration: {
        formatted: formattedDuration,
        raw: item.details.duration
      },
      light: Math.round((item.details.light / 3600) * 10) / 10,
      deep: item.details.deep ? Math.round((item.details.deep / 3600) * 10) / 10 : 0,
      rem: Math.round((item.details.rem / 3600) * 10) / 10,
      image: `https://jawbone.com${item.snapshot_image}`
    }
  })
}

function getSleep () {
  return new Promise(resolve => {
    const url = jawboneUrl + 'sleeps'
    const headers = { 'Authorization': `Bearer ${process.env.JAWBONE_TOKEN}` }

    return request({ url, headers, timeout: +process.env.REQUEST_TIMEOUT }, (error, response, body) => {
      // check if the result is good to process
      const requestCheck = checkRequest(error, response)
      if (requestCheck) {
        return resolve({ error: 'Something went wrong' })
      }

      const json = JSON.parse(body)

      if (json.data && json.data.items.length <= 0) {
        return resolve({ error: 'No sleep data' })
      }

      const sleeps = processSleeps(json.data.items)

      resolve(sleeps)
    })
  })
}

function processSteps (steps) {
  return steps.map(item => {
    const date = getDate(item.date)

    const DONUT_CALORIES = 195

    return {
      time: {
        human: date.toDateString(),
        iso: date.toISOString()
      },
      distance: {
        formatted: Math.round((item.details.distance / 1000) * 10) / 10,
        raw: item.details.distance
      },
      calories: {
        amount: Math.round(item.details.calories),
        donuts: Math.floor((item.details.calories / DONUT_CALORIES) * 10) / 10
      },
      activeTime: Math.round((item.details.active_time / 3600) * 10) / 10,
      steps: item.details.steps,
      image: `https://jawbone.com${item.snapshot_image}`
    }
  })
}

function getSteps () {
  return new Promise(resolve => {
    const url = jawboneUrl + 'moves'
    const headers = { 'Authorization': `Bearer ${process.env.JAWBONE_TOKEN}` }

    return request({ url, headers, timeout: +process.env.REQUEST_TIMEOUT }, (error, response, body) => {
      // check if the result is good to process
      const requestCheck = checkRequest(error, response)
      if (requestCheck) {
        return resolve({ error: 'Something went wrong' })
      }

      const json = JSON.parse(body)

      if (json.data && json.data.items.length <= 0) {
        return resolve({ error: 'No sleep data' })
      }

      const steps = processSteps(json.data.items)

      resolve(steps)
    })
  })
}

module.exports = {
  getRestingHeartrate,
  getSleep,
  getSteps
}
