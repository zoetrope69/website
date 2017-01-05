'use strict'
require('dotenv').load() // bring in enviroment vars

const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const http = require('http').Server(app)
const mcache = require('memory-cache')

const getBooks = require('./books')
const getCode = require('./code')
const getFilms = require('./films')
const getGigs = require('./gigs')
const getLocations = require('./locations')
const getPodcasts = require('./podcasts')
const getProductivity = require('./productivity')
const getTracks = require('./tracks')
const getTweets = require('./tweets')
const getVids = require('./vids')

const minifyHTML = require('express-minify-html')

app.use(minifyHTML({
  override: true,
  exception_url: false,
  htmlMinifier: {
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeEmptyAttributes: true
  }
}))

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static(`${__dirname}/public`))

http.listen(3000, () => {
  console.log('Listening on *:3000')
})

const cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
      res.send(cachedBody)
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000)
        res.sendResponse(body)
      }
      next()
    }
  }
}

function getData () {
  return new Promise((resolve, reject) => {
    const data = [
      getBooks(),
      getCode(),
      getFilms(),
      getGigs(),
      getLocations(),
      getPodcasts(),
      getProductivity(),
      getTracks(),
      getTweets(),
      getVids()
    ]

    const dataNames = [
      'books',
      'code',
      'films',
      'gigs',
      'locations',
      'podcasts',
      'productivity',
      'tracks',
      'tweets',
      'vids'
    ]

    Promise.all(data).then((results) => {
      var date = new Date()

      const output = {
        time: {
          human: `${date.toDateString()} ${date.toLocaleTimeString('en-GB')}`,
          iso: date.toISOString()
        }
      }

      for (let i = 0; i < results.length; i++) {
        const result = results[i]

        if (result && result.length > 0 && !result.error) {
          output[dataNames[i]] = result
        }
      }

      return resolve(output)
    }).catch(reject)
  })
}

app.get('/self.json', cache(process.env.CACHE_TIME), (req, res) => {
  return getData().then((data) => res.json(data))
                  .catch((error) => {
                    console.log(error)
                    res.json({ error: 'Something went wrong' })
                  })
})

app.get('/', cache(process.env.CACHE_TIME), (req, res) => {
  return getData().then((data) => res.render('home', data))
                  .catch((error) => {
                    console.log(error)
                    res.render('home', {})
                  })
})
