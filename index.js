// bring in enviroment vars
var dotenv = require('dotenv');
dotenv.load();

console.log(process.env.NODE_ENV);

var express = require('express'),
    exphbs  = require('express-handlebars'),
    app = express(),
    http = require('http').Server(app),

    io = require('socket.io')(http),

    request = require('request'),

    LastFmNode = require('lastfm').LastFmNode,
    lastfm = new LastFmNode({
        api_key: process.env.LASTFM_API,    // sign-up for a key at http://www.last.fm/api
        secret:  process.env.LASTFM_SECRET,
        useragent: process.env.LASTFM_USERAGENT
    }),

    ig = require('instagram-node').instagram(),

    moment = require('moment');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

http.listen(3000, function(){
    console.log('listening on *:3000');
});

io.on('connection', function(socket){

    songkickPrevious(function(data){
        console.log('songkick previous');
        io.emit('songkick previous', data);
    });

    songkickUpcoming(function(data){
        console.log('songkick upcoming');
        io.emit('songkick upcoming', data);
    });

    latestTrack(function(data){
        console.log('lastfm latest');
        io.emit('lastfm latest', data);
    });

    favArtist(function(data){
        console.log('lastfm fav');
        io.emit('lastfm fav', data);
    });

    instagramPosts(function(posts){
        console.log('instagram');
        io.emit('instagram', posts);
    });

    console.log('a user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

});

app.get('/', function(req, res){

    latestTrack(function(track){
        instagramPosts(function(posts){
            res.render('home', {
                time: moment().format('hh:mm A'),
                track: track,
                instagram: posts
            });
        });
    });

});

// instagram

function instagramPosts(callback){

    var userId = '361667513';

    ig.use({ access_token: process.env.INSTAGRAM_ACCESSTOKEN });
    ig.use({ client_id: process.env.INSTAGRAM_CLIENTID,
             client_secret: process.env.INSTAGRAM_SECRET });

     ig.user_media_recent(userId, {}, function(err, medias, pagination, remaining, limit){

         var posts = [];

         for(var i = 0; i < medias.length; i++){
             var media = medias[i];

             var post = {
                 time: media.created_time,
                 url: media.link,
                 image: media.images.standard_resolution.url,
                 caption: media.caption.text
             };

             posts.push(post);
         }

         callback(posts);

     });

 }

// last.fm

function favArtist(callback){

    // who I'm into link at the moment
	var username = 'zaccolley',
        period = ['overall', '7day', '1month', '3month', '6month', '12month']; // different periods

    var recentTracks = lastfm.request('user.gettopartists', { username: username, period: period[1], limit: 1 });

    recentTracks.on('error', function(json){
        console.log('err', json);
    });

    recentTracks.on('success', function(data){

        // if it has found a name for the artist
		if( typeof data.topartists.artist[0] !== 'undefined' ){

            var artist = {
            	name: data.topartists.artist[0].name,
    			url: data.topartists.artist[0].url
            };

            callback(artist);

		}

    });

}

function latestTrack(callback){

    var username = 'zaccolley',
        trackStream = lastfm.stream(username);

    if( trackStream.isStreaming() ){

        trackStream.on('nowPlaying', function(data){
            console.log(data);

            var image = 'img/albumart.png';
            if( data.hasOwnProperty('image') && data.image[3]['#text'] !== '' ){
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

    }else{

        var recentTracks = lastfm.request('user.getrecenttracks', { username: username, limit: 1 });

        recentTracks.on('error', function(json){
            console.log('err', json);
        });

        recentTracks.on('success', function(data){
            // if the json does exist (last.fm isn't borked)
            if(typeof data.recenttracks.track !== 'undefined'){
                data = data.recenttracks.track[0];
                console.log();

                var image = 'img/albumart.png';
                if( data.hasOwnProperty('image') && data.image[3]['#text'] !== '' ){
                    image = data.image[3]['#text'];
                }

                // simplify response
                var track = {
                    time: +new Date()/1000 - data.date.uts,
                    playing: false,

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

function songkickPrevious(callback){

	var user = 'zaccolley',
        apiKey = 'sqcuaFOxKzXLxuc7',
        order = 'desc',
        url = 'http://api.songkick.com/api/3.0/users/' +
                user + '/gigography.json' +
                '?apikey=' + apiKey +
                '&order=' + order;

    request(url, function (error, response, body){
        if(!error && response.statusCode == 200){

            var data = JSON.parse(body),

                events = data.resultsPage.results.event,
    			event = events[0],

                date = event.end.date.split('-'),
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

function songkickUpcoming(callback){

    var user = 'zaccolley',
        apiKey = 'sqcuaFOxKzXLxuc7',
    	order = 'asc',
        url = 'http://api.songkick.com/api/3.0/users/' +
              user + '/calendar.json?reason=attendance' +
              '&apikey=' + apiKey +
              '&order=' + order;

    request(url, function (error, response, body) {
        if(!error && response.statusCode == 200){

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
