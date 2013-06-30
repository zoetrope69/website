<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;">
	<title>Zac Colley</title>
	<link rel="shortcut icon" href="img/notepad.png" />
	<link rel="stylesheet" href="css/style.css">

	<meta property="og:title" content="Zac Colley" />
	<meta property="og:url" content="http://zaccolley.com/" />
	<meta property="og:description" content="Zac Colley &bull; Web Developer and Designer" />
	<meta property="og:image" content="<?php echo $gravatar; ?>" />
</head>
<body>
<article>

	<?php
		/* This grabs my gravatar or reverts to a default image if it can't get it. */	
		$email = "zaccolley@gmail.com";
		$defaultImg = "img/defaultface.png";
		$dimensions = 100;

		$gravatar = "http://www.gravatar.com/avatar/" . md5($email)  . "?d=" . urlencode($defaultImg) . "&amp;s=" . $dimensions;
	?>
	
	<section class="head">
		<img id="face" src="<?php echo $gravatar; ?>" alt="My gravatar image">
		<h1 id="title">Zac Colley</h1>		
	</section>

	<section class="notepad">
		<header>
			<h1>home - Notepad</h1>
			<ul>
				<li id="min"></li>
				<li id="max"></li>
				<li id="close">X</li>
			</ul>
		</header>

		<nav>
			<ul>
				<li id="home"><a href="/#home">Home</a></li>
				<li id="me"><a href="/#me">Me</a></li>
				<li id="work"><a href="/#work">Work</a></li>
				<li id="stuff"><a href="/#stuff">Stuff</a></li>
				<li id="blog"><a href="http://blog.zaccolley.com">Blog</a></li>
			</ul>
		</nav>

		<section class="textarea" contenteditable="true">
			<section id="homecontent">
				<h2>Awww... 404.</h2>
				<p>Try again, I guess?</p>
				<p><a href="/">Go home!</a></p>				
			</section>
		</section>
	</section>
</article>
<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
<script src="http://code.jquery.com/ui/1.10.2/jquery-ui.js"></script>
<script type="text/javascript" src="js/scripts.js"></script>
<script type="text/javascript" src="js/prefixfree.js"></script>
</body>
</html>