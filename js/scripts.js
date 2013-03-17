/* on load */

(function(){
	$('.textarea section').hide();
	$('#homecontent').fadeIn(500);
})();

/* nav links */

$('nav li').mouseup(function(){
	$('.textarea section').hide();
	$('#' + this.id + 'content').fadeIn(500);
	$('body').toggleClass('colourvariation');
});

/* top right buttons */

$('header li').mouseup(function(){
	$('.notepad').toggleClass('notepad-' + this.id);
	if(this.id == 'close'){
		$('.notepad').fadeOut(500);
		$('body').toggleClass("trip");
		$('.notepad').fadeIn(500);
	}
});

/* last.fm data grabbing */

var url = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&limit=2&user=zaccolley&api_key=fa5687767b9d45951f19973b88ff46d9&format=json';
$.getJSON(url, function(json){

	var output = "";
	if(typeof json.recenttracks.track !== 'undefined'){ // if the json doesn't exist (last.fm is borked)
		var name = json.recenttracks.track[0].name;
		var artist = json.recenttracks.track[0].artist["#text"];
		var url = json.recenttracks.track[0].url;

		if(typeof json.recenttracks.track[0]["@attr"] !== 'undefined'){ // if the track is now playing
			output = output + "I'm now listening to <a href='" + url + "' target='_blank' contenteditable='false'>'" + name + "' by " + artist + "</a>. ";
		}else{
			var time = +new Date()/1000 - json.recenttracks.track[0].date["uts"]; // get the time in seconds of when it was scrobbled
			output = output + "I listened to <a href='" + url + "' target='_blank' contenteditable='false'>'" + name + "' by " + artist + "</a> " + time + " seconds ago. ";
		}
	}
	$('#mostrecenttrack').html(output);
});