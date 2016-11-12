'use strict';
require('dotenv').load(); // bring in enviroment vars

const express = require('express');
const exphbs  = require('express-handlebars');
const app = express();
const http = require('http').Server(app);
const mcache = require('memory-cache');

const tracks = require('./tracks');
const tweets = require('./tweets');
const gigs = require('./gigs');
const films = require('./films');
const books = require('./books');

const moment = require('moment');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

http.listen(3000, () => {
  console.log('Listening on *:3000');
});

const cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url;
    let cachedBody = mcache.get(key);
    if (cachedBody) {
      res.send(cachedBody);
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body);
      }
      next();
    }
  }
}

function getData() {
  return new Promise((resolve, reject) => {
    return Promise.all([tracks(10), tweets(), gigs(), films(), books()]).then((results) => {
      var date = new Date();
      return resolve({
        time: {
          human: date.toDateString(),
          iso: date.toISOString()
        },
        tracks: results[0],
        tweets: results[1],
        gigs: results[2],
        films: results[3],
        books: results[4].filter(book => book.shelf === 'read')
      });
    });
  });
}

app.get('/self.json', cache(process.env.CACHE_TIME), (req, res) => {
  return getData().then((data) => res.json(data))
                  .catch((reason) => res.json({ error: reason }));
});

app.get('/', cache(process.env.CACHE_TIME), (req, res) => {
  return getData().then((data) => res.render('home', data))
                  .catch((reason) => res.render('home', { error: reason }));
});
