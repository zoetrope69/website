/* on load */

(function(){
	$('.notepad').addClass('notepad-transitions'); // Adding in after loading to try and combat transitions on load?..
	$('.textarea').find('section').hide();
	$('#homecontent').fadeIn(500);
	updateLastfmText();
})();

/* nav links */

$('nav').find('li').mouseup(function(){
	$('.textarea').find('section').hide();
	$('#' + this.id + 'content').fadeIn(500);
	$('body').toggleClass('colourvariation');
	var pageName = this.id.charAt(0).toUpperCase() + this.id.slice(1);
	document.title = pageName  + " - Zac Colley";
});

/* top right buttons */

$('header').find('li').mouseup(function(){
	$('.notepad').toggleClass('notepad-' + this.id);
	if(this.id == 'close'){
		$('.notepad').fadeOut(500);
		$('body').toggleClass("trip");
		$('.notepad').fadeIn(500);
	}
});

/* last.fm data grabbing */

function updateLastfmText(){
	var user = 'zaccolley';
	var recentTracks = 2;
	var apiKey = 'fa5687767b9d45951f19973b88ff46d9';
	var url = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&limit=' + recentTracks + '&user=' + user + '&api_key=' + apiKey + '&format=json';
	$.getJSON(url, function(json){

		var output = "";
		if(typeof json.recenttracks.track !== 'undefined'){ // if the json doesn't exist (last.fm is borked)
			var name = json.recenttracks.track[0].name;
			var artist = json.recenttracks.track[0].artist["#text"];
			var url = json.recenttracks.track[0].url;

			if(typeof json.recenttracks.track[0]["@attr"] !== 'undefined'){ // if the track is now playing
				output = output + "I'm listening to <a href='" + url + "' target='_blank' contenteditable='false'>'" + name + "' by " + artist + "</a>. ";
			}else{
				var time = +new Date()/1000 - json.recenttracks.track[0].date["uts"]; // get the time in seconds of when it was scrobbled
				output = output + "I listened to <a href='" + url + "' target='_blank' contenteditable='false'>'" + name + "' by " + artist + "</a> " + timeConvert(time);
			}
		}
		$('#mostrecenttrack').html(output);
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
	if(time != ""){ time = Math.round(time); }
	if(time > 1){ plural = "s"; } // if theres more than one of a time measure it becomes plural
	return time + " " + timeMeasure + plural + " ago. ";
}