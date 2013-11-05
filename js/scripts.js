/* on load */
(function(){
	updateData(); // from last.fm and github etc
	$('.notepad').addClass('notepad-transitions'); // Adding in after loading to try and combat transitions on load?..
    $('.notepad').draggable({ handle: 'header', containment: 'document', revert: true});
    $('.notepad').draggable({ cancel: 'ul' });
	
	$('.textarea').find('section').hide();

	// if the URL has a hash in we want to load that section
	var hash = window.location.hash.substring(1).toLowerCase(); // we dont want the # at the start of the hash e.g /#home
	var validHash = false;
	console.log(hash); 

	// nice to meat you
	if(hash == "meat"){ $('body').css('background', 'url("img/bg/meat.jpg")'); }

	$('nav').find('li').each(function(){
		if(this.id == hash){ validHash = true; }
	});
	if(validHash){ sectionChange(hash); } // if there is a hash (more than one so no dead # links)
	else{ $('#homecontent').fadeIn(750); }

	replaceFace(); // replaces the 'o' in 'colley' with my face
})();

/* nav links */

$('nav').find('li').mouseup(function(){
	if(!$('#' + this.id + 'content').is(":visible")){
		sectionChange(this.id);
		colourChange();	// change the header and backgorund colours yo
	}
});

function colourChange(){
	var randNo = Math.floor(Math.random() * 360); 
	var randBackColour = 'hsl(' + randNo + ', 20%, 40%)';
	var randTitleColour = 'hsl(' + (randNo - 180);
	var randTitleFrontColour = randTitleColour + ', 50%, 40%)';
	var randTitleShadowColour = randTitleColour + ', 50%, 20%)';

	// change the colours!

	$('body').css('background-color', randBackColour);
	$('#title').css('color', randTitleFrontColour);
	$('#title').css('text-shadow', 	'0 0.1em ' + randTitleShadowColour);
	$('#face').css('border-color',  randTitleShadowColour);

	$('.textarea').find('a').css('color', randTitleShadowColour); // changes the link colours too
}

function sectionChange(id){

	$('.textarea').find('section').hide();
	$('#' + id + 'content').fadeIn(500);

	var pageName = id.charAt(0).toUpperCase() + id.slice(1);
	document.title = pageName  + ' - Zac Colley';
	$('header').find('h1').text(id);
}

/* top right buttons */

$('header').find('li').mouseup(function(){
	$('.notepad').toggleClass('notepad-' + this.id);
	if(this.id == 'close'){
		$('.notepad').fadeOut(500);
		$('body').toggleClass("trip");
		$('.notepad').fadeIn(500);
	}
});

/* replace 'O' in heading with my face */

function replaceFace(){
	var url = $('#face').attr('src');
	$('#face').remove();
	$('#title').delay(250).fadeOut(500, function(){
		$('#title').replaceWith('<h1 id="title" style="display:none">Zac C<img style="display: inline-block;" id="face" src="' + url + '" alt="O">lley</h1>');
		$('#title').fadeIn(500);
	});
}


/* data getting */
/* ------------ */

function updateData(){
	updateLastfmText();
	updateGitHubText();
	
	// clickable link creation
	$('a').each(function(){
		$(this).attr('contenteditable', false);
	});
}

/* github */

function updateGitHubText(){
	var user = 'zaccolley';
	var callback = 'displayGithubData'; // the callback calls the function below which handles the json
	var url = 'https://api.github.com/users/' + user + '/repos?callback=' + callback; 
	var output = "";	
	$.getScript(url); // get and run displayGithubData() from url
}

function displayGithubData(json){
	var ownedRepos = [];
	for(var repo = 0; repo < json.data.length; repo++){ 
		var forked = json.data[repo].fork; // add to array only repos that are from original account, no forks
		if(!forked){ ownedRepos.push(json.data[repo]); }
	}
	// get a psuedo-randomly selected repo
	var repo = ownedRepos[Math.floor(Math.random() * ownedRepos.length)];
	// process all that data into a nice lil' link
	var linkedRepo = "<a href='" +  repo.svn_url + "' title='" +  repo.description + "' target='_blank' contenteditable='false'>" + repo.name + "</a>";
	output = "I started " + linkedRepo + ", which was mostly wrote in " + repo.language + ".";
	$('#githubrepos').html(output);
}

/* last.fm */

function updateLastfmText(){
	var user = 'zaccolley';

	// recent tracks
	var recentTracks = 2;
	var apiKey = 'fa5687767b9d45951f19973b88ff46d9';
	var url = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&limit=' + recentTracks + '&user=' + user + '&api_key=' + apiKey + '&format=json';
	$.getJSON(url, function(json){
		var output = "";
		if(typeof json.recenttracks.track !== 'undefined'){ // if the json does exist (last.fm isn't borked)
			var name = json.recenttracks.track[0].name;
			var artist = json.recenttracks.track[0].artist["#text"];
			var url = json.recenttracks.track[0].url;

			if(typeof json.recenttracks.track[0]["@attr"] !== 'undefined'){ // if the track is now playing
				output += "I'm listening to <a href='" + url + "' target='_blank' contenteditable='false'>'" + name + "' by " + artist + "</a> right now! ";
			}else{
				var time = +new Date()/1000 - json.recenttracks.track[0].date["uts"]; // get the time in seconds of when it was scrobbled
				output += "I listened to <a href='" + url + "' target='_blank' contenteditable='false'>'" + name + "' by " + artist + "</a> " + timeConvert(time);
			}
		}
		$('#mostrecenttrack').html(output + $('#mostrecenttrack').html());
	});

	// who I'm into link at the moment
	var period = ['overall', '7day', '1month', '3month', '6month', '12month']; // different periods
	var url = 'http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&limit=1&period=' + period[1] + '&user=' + user + '&api_key=' + apiKey + '&format=json';
	$.getJSON(url, function(json){
		if(json.topartists.artist.name){ // if it has found a name for the artist
			var artist = json.topartists.artist.name;
			var url = json.topartists.artist.url;
			$('#mostlistenedartist').text(artist);
			$('#mostlistenedartist').attr("href", url);
		} // the default link is to Daft Punk 'cause I think they're future proof cool
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