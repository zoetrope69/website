/* on load */

(function(){
	$('#homecontent').show();
	$('#mecontent').hide();
	$('#workcontent').hide();
})();

/* nav links */

$('#home').mousedown(function(){
	$('#homecontent').show();
	$('#mecontent').hide();
	$('#workcontent').hide();
	$('body').css("background", "#E9ABA7");
});

$('#me').mousedown(function(){
	$('#homecontent').hide();
	$('#mecontent').show();
	$('#workcontent').hide();
	$('body').css("background", "#306DBF");
});

$('#work').mousedown(function(){
	$('#homecontent').hide();
	$('#mecontent').hide();
	$('#workcontent').show();
	$('body').css("background", "#CBD966");
});

/* top right buttons */

$('.min').click(function(){
	$('.notepad').toggleClass('notepad-min');
});

$('.max').click(function(){
	$('.notepad').toggleClass('notepad-max');
});

$('.close').click(function(){
	$('.notepad').fadeOut(500);
	$('body').toggleClass("trip");
	$('.notepad').fadeIn();
});