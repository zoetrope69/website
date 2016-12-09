'use strict'
require('dotenv').load() // bring in enviroment vars

const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const http = require('http').Server(app)
const mcache = require('memory-cache')

const tracks = require('./tracks')
const tweets = require('./tweets')
const gigs = require('./gigs')
const films = require('./films')
const books = require('./books')
const code = require('./code')

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
    var data = [
      books(),
      code(),
      films(),
      gigs(),
      tracks(),
      tweets()
    ]

    return Promise.all(data).then((results) => {
      var date = new Date()

      const output = {
        time: {
          human: `${date.toDateString()} ${date.toLocaleTimeString('en-GB')}`,
          iso: date.toISOString()
        }
      }

      if (!results[0].error) {
        output.books = results[0].filter(book => book.shelf === 'read')
      }

      if (!results[1].error) {
        output.code = results[1].filter(item => item.type === 'push')
      }

      if (!results[2].error) {
        output.films = results[2]
      }

      if (!results[3].error) {
        output.gigs = results[3]
      }

      if (!results[4].error) {
        output.tracks = results[4]
      }

      if (!results[5].error) {
        output.tweets = results[5]
      }

      return resolve(output)
    })
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
