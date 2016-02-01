/* on load */
(function(){

  var socket = io();

  socket.on('instagram', function(posts){

    $('.instagram-photos').html('');

    for(var i = 0; i < posts.length; i++){
      var post = posts[i];

      var template = `
        <li class="instagram-photo">
          <a href="${post.url}">
            <img src="${post.image}" />
            <span class="instagram-photo__caption">${post.caption}</span>
          </a>
        </li>
      `.trim();

      $('.instagram-photos').append(template);
    }

  });

  socket.on('lastfm fav', function(artist){

    $('.info-lastfm--fav').html("find myself listening to a lot of <a href='" + artist.url + "'>" + artist.name.toLowerCase() + "</a> at the mo ");

  });

  socket.on('lastfm latest', function(track) {

    if (track) {
      var output = '';

      if (track.playing) { // if the track is now playing
        output += "bet ya didn't know i'm jigging and jamming to <a href='" + track.url + "' target='_blank' contenteditable='false'>'" + track.name.toLowerCase() + "' by " + track.artist.toLowerCase() + "</a> right now. ";
      } else {
        output += timeConvert(track.time) + " ago I listened to <a href='" + track.url + "' target='_blank' contenteditable='false'>'" + track.name.toLowerCase() + "' by " + track.artist.toLowerCase() + "</a>. ";
      }

      $('.music__artist').html(track.artist);
      $('.music__song').html(track.name);
      $('.music__art').attr('src', track.image);

      $('.music').removeClass('music--hidden');


      $('.info-lastfm--latest').html(output);
    }

  });

  socket.on('songkick previous', function(data){
    $('.info-songkick--previous').html("went to <a href='" + data.url + "'>" + data.name.toLowerCase() + "</a> " + timeConvert(data.time) + " ago. ");
  });

  socket.on('songkick upcoming', function(data){
    var attendanceMessage = '';

    if(data.attendance == "im_going"){
      attendanceMessage = "i'll be at ";
    }

    if(data.attendance == "i_might_go"){
      attendanceMessage = "thinking of ";
    }

    $('.info-songkick--upcoming').html('in ' + timeConvert(data.time) + ' ' + attendanceMessage + "<a href='" + data.url + "'>" + data.name.toLowerCase() + "</a> too. ");
  });

	if ($(window).width() > 600) {

		$('.window').addClass('window-transitions'); // Adding in after loading to try and combat transitions on load?..
	    $('.window').draggable({ handle: 'header', containment: 'document'});
	    $('.window').draggable({ cancel: 'ul' });

	    $('.music').draggable({ containment: 'document'});
	    $('.music').draggable({ cancel: '.music-inner' });

        $('.merlin').draggable({ containment: 'document'});

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

function timeConvert(time){
	var timeMeasure = "seconds ";

		 if(time < 10){ time = ""; timeMeasure = "a few seconds"; }
	else if(time < 60){ timeMeasure = "seconds"; }
	else if(time < 3600){ time = time / 60; timeMeasure = "minute"; }
	else if(time < 86400){ time = time / 3600; timeMeasure = "hour"; }
	else if(time < 604800){ time = time / 86400; timeMeasure = "day"; }
	else if(time >= 604800){ time = time / 604800; timeMeasure = "week"; }

	var plural = '';

	if (time !== ''){
    time = Math.round(time);
  }

  if (time > 1) { // if theres more than one of a time measure it becomes plural
    plural = 's';
  }

	var timeWords = ['zero', 'one', 'two', 'three', 'four', 'five',
                   'six', 'seven', 'eight', 'nine', 'ten'];
	if(time < 10){
		time = timeWords[time];
	}

	return time + " " + timeMeasure + plural;
}
