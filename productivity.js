'use strict'
require('dotenv').load() // bring in enviroment vars

const request = require('request')

const rescueTimeUrl = `https://www.rescuetime.com/anapi/daily_summary_feed?key=${process.env.RESCUE_TIME_API}`

function checkRequest (error, response) {
  if (error) {
    return error
  }

  if (response.statusCode !== 200) {
    return `Error: Response was not OK`
  }

  return false
}

function processFormattedDuration (duration) {
  return duration.replace('h', ' hours and').replace('m', ' minutes')
}

function processDay (day) {
  const date = new Date(day.date)
  day = {
    time: {
      human: date.toDateString(),
      iso: date.toISOString()
    },
    score: day.productivity_pulse,
    total_duration: processFormattedDuration(day.total_duration_formatted),
    very_productive: {
      percentage: day.very_productive_percentage,
      duration: processFormattedDuration(day.very_productive_duration_formatted)
    },
    productive: {
      percentage: day.productive_percentage,
      duration: processFormattedDuration(day.productive_duration_formatted)
    },
    neutral: {
      percentage: day.neutral_percentage,
      duration: processFormattedDuration(day.neutral_duration_formatted)
    },
    distracting: {
      percentage: day.distracting_percentage,
      duration: processFormattedDuration(day.distracting_duration_formatted)
    },
    very_distracting: {
      percentage: day.very_distracting_percentage,
      duration: processFormattedDuration(day.very_distracting_duration_formatted)
    }
  }

  return day
}

function getDailySummary () {
  return new Promise(resolve => {
    const url = rescueTimeUrl
    return request({ url, timeout: +process.env.REQUEST_TIMEOUT }, (error, response, body) => {
      // check if the result is good to process
      const requestCheck = checkRequest(error, response)
      if (requestCheck) {
        return resolve({ error: 'Something went wrong' })
      }

      let days = JSON.parse(body)

      days = days.map(processDay)

      resolve(days)
    })
  })
}

module.exports = getDailySummary
