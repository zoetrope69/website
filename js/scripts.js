/* on load */
(function(){
	$('.notepad').addClass('notepad-transitions'); // Adding in after loading to try and combat transitions on load?..
    $('.notepad').draggable({ handle: 'header' });
	$('.textarea').find('section').hide();
	$('#homecontent').fadeIn(500);
	updateData();
})();

/* nav links */

$('nav').find('li').mouseup(function(){
	$('.textarea').find('section').hide();
	$('#' + this.id + 'content').fadeIn(500);

	var pageName = this.id.charAt(0).toUpperCase() + this.id.slice(1);
	document.title = pageName  + ' - Zac Colley';
	$('header').find('h1').text(this.id + ' - Notepad');
	
	var randNo = Math.floor(Math.random() * 360); 
	var randBackColour = 'hsl(' + randNo + ', 20%, 40%)';
	var randTitleColour = 'hsl(' + (randNo - 180) + ', 50%, 40%)';
	$('body').css('background-color', randBackColour);
	$('#title').css('color', randTitleColour);
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

/* data getting */
/* ------------ */

function updateData(){
	updateLastfmText();
	updateGitHubText();
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
	var ownedRepos = new Array();
	for(var repo = 0; repo < json.data.length; repo++){ 
		var forked = json.data[repo].fork; // add to array only repos that are from original account, no forks
		if(!forked){ ownedRepos.push(json.data[repo]); }
	}
	// get a psuedo-randomly selected repo
	var repo = ownedRepos[Math.floor(Math.random() * ownedRepos.length)];
	// process all that data into a nice lil' link
	var linkedRepo = "<a href='" +  repo.svn_url + "' title='" +  repo.description + "' target='_blank' contenteditable='false'>" + repo.name + "</a>";
	output = "I started " + linkedRepo + ", which was wrote in " + repo.language + ".";
	$('#githubrepos').html(output);
}

/* last.fm */

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
				output += "I'm listening to <a href='" + url + "' target='_blank' contenteditable='false'>'" + name + "' by " + artist + "</a>. ";
			}else{
				var time = +new Date()/1000 - json.recenttracks.track[0].date["uts"]; // get the time in seconds of when it was scrobbled
				output += "I listened to <a href='" + url + "' target='_blank' contenteditable='false'>'" + name + "' by " + artist + "</a> " + timeConvert(time);
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