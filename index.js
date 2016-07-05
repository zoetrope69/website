'use strict';
require('dotenv').load(); // bring in enviroment vars

var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();
var http = require('http').Server(app);

var music = require('./music');
var tweets = require('./tweets');
var gigs = require('./gigs');

var moment = require('moment');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

http.listen(3000, () => {
  console.log('listening on *:3000');
});

app.get('/self.json', (req, res) => {
  Promise.all([music, tweets, gigs]).then((results) => {    
    return res.json({
      time: + new Date(), // get current timestamp
      music: results[0],
      tweets: results[1],
      gigs: results[2]
    });
  }, (reject) => console.log(reject));
});

// app.get('/', (req, res) => {
//
//   latestTweets((tweets) => {
//     var tweet = tweets[0];
//
//     tweet = {
//       text: twitterText.autoLink(twitterText.htmlEscape(tweet.text)),
//       date: moment(new Date(tweet.created_at)).format('h:mm A - MM MMM YYYY')
//     };
//
//     latestTrack(function(track){
//       track = track || 'images/albumart.png';
//       res.render('home', {
//         time: moment().format('hh:mm A'),
//         track: track,
//         tweet: tweet
//       });
//     });
//
//   });
//
// });
