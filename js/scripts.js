/* on load */

(function(){
	$('#homecontent').show();
	$('#mecontent').hide();
	$('#workcontent').hide();
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