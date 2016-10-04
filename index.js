'use strict';
require('dotenv').load(); // bring in enviroment vars

const express = require('express');
const exphbs  = require('express-handlebars');
const app = express();
const http = require('http').Server(app);

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

const getData = new Promise((resolve, reject) => {
  Promise.all([tracks, tweets, gigs, films, books]).then((results) => {
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
  }, reject);
});

app.get('/self.json', (req, res) => {
  return getData.then((data) => res.json(data),
                      (reason) => res.json({ error: reason }));
});

app.get('/', (req, res) => {
  return getData.then((data) => res.render('home', data),
                      (reason) => res.render('home', { error: reason }));
});
