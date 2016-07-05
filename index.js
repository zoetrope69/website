'use strict';
require('dotenv').load(); // bring in enviroment vars

var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();
var http = require('http').Server(app);

var tracks = require('./tracks');
var tweets = require('./tweets');
var gigs = require('./gigs');
var films = require('./films');
var books = require('./books');

var moment = require('moment');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

http.listen(3000, () => {
  console.log('Listening on *:3000');
});

const getData = new Promise((resolve, reject) => {
  Promise.all([tracks, tweets, gigs, films, books]).then((results) => {
    return resolve({
      time: + new Date(), // get current timestamp
      tracks: results[0],
      tweets: results[1],
      gigs: results[2],
      films: results[3],
      books: results[4]
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
