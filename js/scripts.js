/* on load */
(function(){
	updateData(); // from last.fm and github etc

	if($(window).width() > 600){

		$('.window').addClass('window-transitions'); // Adding in after loading to try and combat transitions on load?..
	    $('.window').draggable({ handle: 'header', containment: 'document'});
	    $('.window').draggable({ cancel: 'ul' });

	    $('.music').draggable({ containment: 'document'});
	    $('.music').draggable({ cancel: '.music-inner' });

		$('.window').on('click', function(){
			$('.window--about').css('z-index', 50);
			$('.window--pictures').css('z-index', 30);
			$('.music').css('z-index', 20);
			$(this).css('z-index', 80);
		});

		$('.window').draggable({
			start: function(){
				$('.window--about').css('z-index', 50);
				$('.window--pictures').css('z-index', 30);
				$('.music').css('z-index', 20);
				$(this).css('z-index', 80);
			}
		});
	}

	if($(window).width() < 600){ $('.window--about .textarea').attr('contenteditable', false); }

	$('.window--about .textarea').find('section').hide();

	// handle popstate on load

	pushed = false;
	var initialUrl = location.href;
	initPopState(initialUrl);

	urlNavigate(); // navigate!

	clock();

})();

function clock(){
	window.setInterval(function(){
		$('.clock__time').text(moment().format('hh:mm A'));
	}, 1000);
}

/* nav links */

$('.window--about nav').find('a').mouseup(function(e){
	navigate($(this).attr('href').substring(1));
});

$('.copy-nav').click(function(e){
	navigate($(this).attr('href').substring(1));
	// contenteditable removes the functionality of the a tag
	window.history.pushState(null, null, $(this).attr('href'));
	pushed = true;
});

function initPopState(initialUrl){

	// for back and forward
	window.onpopstate = function(e){
		var initialUrl = location.href;

		var onloadPop = !pushed && location.href == initialUrl;
		pushed = true;

		if(!onloadPop){
			urlNavigate();
		}
	};

}

function urlNavigate(){
	// if the URL has a hash in we want to load that section
	var hash = window.location.hash.substring(1).toLowerCase(); // we dont want the # at the start of the hash e.g /#home
	var validHash = false;

	// nice to meat you
	if(hash == "meat"){ $('body').css('background', 'url("img/bg/meat.jpg")'); }
	if(hash == "spookz"){ $('body').css('background', 'url("img/bg/spooky.jpg")'); }

	$('.window--about nav').find('a').each(function(){
		var href = $(this).attr('href');
		if(href.substring(1) == hash){ validHash = true; }
	});

	if(validHash){ navigate(hash); } // if there is a hash (more than one so no dead # links)
	else{ sectionChange('home'); }
}

function navigate(id){
	// if the current link isn't already
	if(!$('#' + id).is(":visible")){
		sectionChange(id);
	}
}

function sectionChange(id){
	$('.window--about .textarea').find('section').hide();
	$('#' + id).fadeIn(500);

	var pageName = id.charAt(0).toUpperCase() + id.slice(1);
	document.title = pageName  + ' - Zac Colley';
}


/* data getting */
/* ------------ */

function updateData(){

	updateLastfm();
	window.setInterval(function(){
		updateLastfm();
	}, 90000);

	updateSongkick();
	updateInstagram();
}

/* instagram */

function updateInstagram(){
	var feed = new Instafeed({
		get: 'user',
		userId: 361667513,
		accessToken: '361667513.467ede5.107744925303438ab0cee5f71e3a8602',
		template: '<li class="instagram-photo"><a href="{{link}}">' +
						'<img src="{{image}}" />' +
						'<span class="instagram-photo__caption">{{caption}}</span>' +
				   '</a>',
		resolution: 'thumbnail'
	});
	feed.run();
}

/* songkick */

function updateSongkick(){

	var user = 'zaccolley';
	var apiKey = 'sqcuaFOxKzXLxuc7';
	var order = 'desc';
	var url = 'http://api.songkick.com/api/3.0/users/' +
				user + '/gigography.json?apikey=' +
				apiKey + '&order=' +
				order + '&jsoncallback=?';

	$.getJSON(url, function(data){
		var events = data.resultsPage.results.event,
			event = events[0],
			name = event.displayName,
			url = event.uri,

			date = event.end.date.split('-'),
			year = date[0],
			month = date[1]-1, // 0 - 11 for months
			day = date[2],
			utcDate = +new Date(Date.UTC(year, month, day)),
			time = (+new Date() - utcDate)/1000;

		$('.info-songkick').append("went to <a href='" + url + "'>" + name.toLowerCase() + "</a> " + timeConvert(time) + " ago. ");
		clickableLinks();
	});

	order = 'asc';
	url = 'http://api.songkick.com/api/3.0/users/' +
			user + '/calendar.json?reason=attendance&apikey=' +
			apiKey + '&order=' +
			order + '&jsoncallback=?';

	$.getJSON(url, function(data){
		var events = data.resultsPage.results.calendarEntry,
			event = events[0],
			name = event.event.displayName,
			url = event.event.uri,
			attendance = event.reason.attendance,
			attendanceMessage = '',

			date = event.event.start.date.split('-'),
			year = date[0],
			month = date[1]-1, // 0 - 11 for months
			day = date[2],
			utcDate = +new Date(Date.UTC(year, month, day)),
			time = (utcDate - +new Date())/1000;

		if(attendance == "im_going"){
			attendanceMessage = "i'll be at ";
		}

		if(attendance == "i_might_go"){
			attendanceMessage = "thinking of ";
		}

		$('.info-songkick').append('in ' + timeConvert(time) + ' ' + attendanceMessage + "<a href='" + url + "'>" + name.toLowerCase() + "</a> too. ");
		clickableLinks();

		$('#home').append("<a class='songkick-credit' href='https://www.songkick.com/users/zaccolley'><img src='img/songkick.png' alt='Concerts by Songkick' /></a>");
	});

}

/* last.fm */

function updateLastfm(){

	var user = 'zaccolley';

	// recent tracks
	var recentTracks = 2;
	var apiKey = 'fa5687767b9d45951f19973b88ff46d9';
	var url = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&limit=' + recentTracks + '&user=' + user + '&api_key=' + apiKey + '&format=json';
	$.getJSON(url, function(json){

		var output = "";

		if(typeof json.recenttracks.track !== 'undefined'){ // if the json does exist (last.fm isn't borked)
			var track = json.recenttracks.track[0];


			var name = track.name;
			var artist = track.artist["#text"];
			var url = track.url;

			var image = 'img/albumart.png';
			if( track.hasOwnProperty('image') && track.image[3]['#text'] !== '' ){
				image = track.image[3]['#text'];
			}

			if(typeof track["@attr"] !== 'undefined'){ // if the track is now playing
				output += "bet ya didn't know i'm jigging and jamming to <a href='" + url + "' target='_blank' contenteditable='false'>'" + name.toLowerCase() + "' by " + artist.toLowerCase() + "</a> right now. ";
			}else{
				var time = +new Date()/1000 - track.date["uts"]; // get the time in seconds of when it was scrobbled
				output += timeConvert(time) + " ago I listened to <a href='" + url + "' target='_blank' contenteditable='false'>'" + name.toLowerCase() + "' by " + artist.toLowerCase() + "</a>. ";
			}

			$('.music__artist').html(artist);
			$('.music__song').html(name);
			$('.music__art').attr('src', image);

			$('.music').removeClass('music--hidden');

		}

		$('.info-lastfm--latest').html(output);
		clickableLinks();

	});

	// who I'm into link at the moment
	var period = ['overall', '7day', '1month', '3month', '6month', '12month']; // different periods
	url = 'http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&limit=1&period=' + period[1] + '&user=' + user + '&api_key=' + apiKey + '&format=json';
	$.getJSON(url, function(json){
		if(json.topartists.artist.name){ // if it has found a name for the artist
			var artist = json.topartists.artist.name;
			var url = json.topartists.artist.url;

			$('.info-lastfm--fav').html("find myself listening to a lot of <a href='" + url + "'>" + artist.toLowerCase() + "</a> at the mo ");
			clickableLinks();
		}
	});

}

function timeConvert(time){
	var timeMeasure = "seconds ";

		 if(time < 10){ time = ""; timeMeasure = "a few seconds"; }
	else if(time < 60){ timeMeasure = "seconds"; }
	else if(time < 3600){ time = time / 60; timeMeasure = "minute"; }
	else if(time < 86400){ time = time / 3600; timeMeasure = "hour"; }
	else if(time < 604800){ time = time / 86400; timeMeasure = "day"; }
	else if(time >= 604800){ time = time / 604800; timeMeasure = "week"; }

	var plural = "";
	if(time !== ""){ time = Math.round(time); }
	if(time > 1){ plural = "s"; } // if theres more than one of a time measure it becomes plural

	var timeWords = [ 'zero', 'one', 'two', 'three', 'four', 'five',
					  'six', 'seven', 'eight', 'nine', 'ten' ];
	if(time < 10){
		time = timeWords[time];
	}

	return time + " " + timeMeasure + plural;
}

// clickable link creation
function clickableLinks(){
	$('a').each(function(){
		$(this).attr('contenteditable', false);
	});
}
