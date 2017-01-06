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

// rescuetime sometimes comes back with percentages totalling 100.1%
// temporary fix while rescue time fix their api
function fixPercentages (day) {
  let percentages = [
    day.very_productive_percentage,
    day.productive_percentage,
    day.neutral_percentage,
    day.distracting_percentage,
    day.very_distracting_percentage
  ]

  percentages = percentages.filter(percentage => percentage > 0)

  const total = percentages.reduce((a, b) => a + b, 0)

  if (total > 100) {
    const remainder = total - 100
    const part = remainder / percentages.length
    percentages = percentages.map(percentage => percentage - part)
  }

  day.very_productive_percentage = percentages[0]
  day.productive_percentage = percentages[1]
  day.neutral_percentage = percentages[2]
  day.distracting_percentage = percentages[3]
  day.very_distracting_percentage = percentages[4]

  return day
}

function processDay (day) {
  day = fixPercentages(day)
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
