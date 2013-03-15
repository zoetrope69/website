/* nav links */

$('#home').click(function(){
	$.ajax({
		url: "home.html",
		cache: false
	}).done(function(html){
		$(".textarea").html(html);
		$('body').css("background", "#E9ABA7");
	});
});

$('#me').click(function(){
	$.ajax({
		url: "me.html",
		cache: false
	}).done(function(html){
		$(".textarea").html(html);
		$('body').css("background", "#306DBF");
	});
});

$('#work').click(function(){
	$.ajax({
		url: "work.html",
		cache: false
	}).done(function(html){
		$(".textarea").html(html);
		$('body').css("background", "#CBD966");
	});
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