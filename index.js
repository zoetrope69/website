'use strict';
require('dotenv').load(); // bring in enviroment vars

var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();
var http = require('http').Server(app);

var io = require('socket.io')(http);

var request = require('request');

var LastFmNode = require('lastfm').LastFmNode;
var lastfm = new LastFmNode({
      api_key: process.env.LASTFM_API, // sign-up for a key at http://www.last.fm/api
      secret:  process.env.LASTFM_SECRET,
      useragent: process.env.LASTFM_USERAGENT
    });

var ig = require('instagram-node').instagram();

var Twitter = require('twitter');
var twitterClient = new Twitter({
      consumer_key: process.env.TWITTER_API,
      consumer_secret: process.env.TWITTER_SECRET,
      access_token_key: process.env.TWITTER_ACCESSTOKEN,
      access_token_secret: process.env.TWITTER_TOKENSECRET
    });
var twitterText = require('twitter-text');

var moment = require('moment');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

http.listen(3000, () => {
  console.log('listening on *:3000');
});

io.on('connection', (socket) => {

  songkickPrevious((data) => {
    console.log('songkick previous');
    io.emit('songkick previous', data);
  });

  songkickUpcoming((data) => {
    console.log('songkick upcoming');
    io.emit('songkick upcoming', data);
  });

  latestTrack((data) => {
    console.log('lastfm latest');
    io.emit('lastfm latest', data);
  });

  favArtist((data) => {
    console.log('lastfm fav');
    io.emit('lastfm fav', data);
  });

  instagramPosts((posts) => {
    console.log('instagram');
    io.emit('instagram', posts);
  });

  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

});

app.get('/', (req, res) => {

  latestTweets((tweets) => {
    var tweet = tweets[0];

    tweet = {
      text: twitterText.autoLink(twitterText.htmlEscape(tweet.text)),
      date: moment(new Date(tweet.created_at)).format('h:mm A - MM MMM YYYY')
    };

    latestTrack(function(track){
      track = track || 'images/albumart.png';
      instagramPosts(function(posts){
        res.render('home', {
          time: moment().format('hh:mm A'),
          track: track,
          tweet: tweet,
          instagram: posts
        });
      });
    });

  });

});



// twitter

function latestTweets (callback) {

  var options = { screen_name: 'zaccolley' };

  twitterClient.get('statuses/user_timeline', options, (error, tweets) => {
    if(!error){
      callback(tweets);
    }
  });

}

function tweetStream (callback) {

  var options = { screen_name: 'zaccolley' };

  twitterClient.stream('statuses/user_timeline', options, (stream) => {

    stream.on('data', (tweet) => {
      console.log(tweet.text);
      callback(tweet);
    });

    stream.on('error', (error) => {
      console.log(error);
    });

  });

}

// instagram

function instagramPosts (callback) {

  var userId = '361667513';

  ig.use({ access_token: process.env.INSTAGRAM_ACCESSTOKEN });
  ig.use({ client_id: process.env.INSTAGRAM_CLIENTID,
           client_secret: process.env.INSTAGRAM_SECRET });

  ig.user_media_recent(userId, {}, (err, medias, pagination, remaining, limit) => {

    var posts = [];

    for (var i = 0; i < medias.length; i++) {
      var media = medias[i];

     var post = {
       time: media.created_time,
       url: media.link,
       image: media.images.standard_resolution.url,
       caption: (media.caption ? media.caption.text : 'untitled')
     };

     posts.push(post);
   }

   callback(posts);

 });

}

// last.fm

function favArtist (callback) {

  // who I'm into link at the moment
  var username = 'zaccolley',
      period = ['overall', '7day', '1month', '3month', '6month', '12month']; // different periods

  var recentTracks = lastfm.request('user.gettopartists', { username: username, period: period[1], limit: 1 });

  recentTracks.on('error', (json) => {
    console.log('err', json);
  });

  recentTracks.on('success', (data) => {

    // if it has found a name for the artist
  	if (typeof data.topartists.artist[0] !== 'undefined') {

      var artist = {
      	name: data.topartists.artist[0].name,
        url: data.topartists.artist[0].url
      };

      callback(artist);

  	}

  });

}

function latestTrack (callback) {

  var username = 'zaccolley',
      trackStream = lastfm.stream(username);

  if (trackStream.isStreaming()) {

    trackStream.on('nowPlaying', (data) => {
      console.log("nowPlaying");

      var image = 'img/albumart.png';
      if (data.hasOwnProperty('image') && data.image[3]['#text'] !== '') {
        image = track.image[3]['#text'];
      }

      // simplify response
      var track = {
        time: +new Date()/1000 - data.date.uts,
        playing: true,

        name: data.name,
        image: image,
        artist: data.artist['#text'],
        album: data.album['#text']
      };

      callback(track);

    });

  } else {

    var recentTracks = lastfm.request('user.getrecenttracks', { username: username, limit: 1 });

    recentTracks.on('error', (json) => {
      console.log('lastfm err', json);
      callback();
    });

    recentTracks.on('success', (data) => {

      console.log('recentTracks success');

      // if the json does exist (last.fm isn't borked)
      if (typeof data.recenttracks.track !== 'undefined') {
        data = data.recenttracks.track[0];

        var image = 'img/albumart.png';
        if (data.hasOwnProperty('image') && data.image[3]['#text'] !== '') {
          image = data.image[3]['#text'];
        }

        var time = +new Date()/1000;

        var nowPlaying = false;

        if (typeof data['@attr'] !== 'undefined') {
          nowPlaying = data['@attr'].nowplaying;
        }

        console.log('nowPlaying', nowPlaying);

        if (!nowPlaying) {
          time = +new Date()/1000 - data.date.uts;
        }

        // simplify response
        var track = {
          time: time,
          playing: nowPlaying,

          name: data.name,
          image: image,
          artist: data.artist['#text'],
          album: data.album['#text'],
        };

        callback(track);
      }

    });

  }

}

// songkick

function songkickPrevious (callback) {

	var user = 'zaccolley';
  var apiKey = 'sqcuaFOxKzXLxuc7';
  var order = 'desc';
  var url = 'http://api.songkick.com/api/3.0/users/' +
            user + '/gigography.json' +
            '?apikey=' + apiKey +
            '&order=' + order;

  request(url, (error, response, body) => {
    if (!error && response.statusCode == 200) {

      var data = JSON.parse(body),

          events = data.resultsPage.results.event,
          event = events[0],

          date = event.start.date.split('-'),
          year = date[0],
          month = date[1]-1, // 0 - 11 for months
          day = date[2],
          utcDate = +new Date(Date.UTC(year, month, day)),
          time = (+new Date() - utcDate)/1000;

      var previousEvent = {
        name: event.displayName,
		    url: event.uri,
        time: time
      };

      callback(previousEvent);

    }

  });

}

function songkickUpcoming (callback) {

  var user = 'zaccolley',
      apiKey = 'sqcuaFOxKzXLxuc7',
    	order = 'asc',
      url = 'http://api.songkick.com/api/3.0/users/' +
            user + '/calendar.json?reason=attendance' +
            '&apikey=' + apiKey +
            '&order=' + order;

  request(url, (error, response, body) => {
    if (!error && response.statusCode == 200) {

      var data = JSON.parse(body),

          events = data.resultsPage.results.calendarEntry,
          event = events[0],

          date = event.event.start.date.split('-'),
          year = date[0],
          month = date[1]-1, // 0 - 11 for months
          day = date[2],
          utcDate = +new Date(Date.UTC(year, month, day)),
          time = (utcDate - +new Date())/1000;

      var upcomingEvent = {
  			name: event.event.displayName,
  			url: event.event.uri,
  			attendance: event.reason.attendance,
        time: time
      };

      callback(upcomingEvent);

    }
	});

}
