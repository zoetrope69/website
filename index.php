<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Zac Colley</title>
	<link rel="shortcut icon" href="img/notepad.png" />
	<link rel="stylesheet" href="css/yougotstyle.css">
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
				<li id="home"><a href="#">Home</a></li>
				<li id="me"><a href="#">Me</a></li>
				<li id="work"><a href="#">Work</a></li>
				<li id="stuff"><a href="#">Stuff</a></li>
				<li id="blog"><a href="http://blog.zaccolley.com">Blog</a></li>
			</ul>
		</nav>

		<section class="textarea" contenteditable="true">
			<section id="homecontent">

				<h2>I'm Zac Colley. :¬)</h2>

				<p>Web developer and designer but also a pretty cool guy*. I am studying at the University of Portsmouth for Web Technologies, a Computer Science course for web fanboys.</p>
				<p>In my spare time I'm apart of <a href="http://www.upracing.co.uk"  target="_blank" contenteditable="false">UPRacing</a> and I am Vice President at our <a href="http://www.uopcs.com"  target="_blank" contenteditable="false">Computing Society</a>. I spend any other time hacking about on code or jamming with music.</p>

				<p>*Arguably. <em>This text is editable by the way.</em> :¬{0</p>

			</section>

			<section id="mecontent">

				<p>You can find me around a few places.</p>

				<h2>Email</h2>
				<p>I like emails. Send me a nice one: <a href="mailto:z@colley.com"  target="_blank" contenteditable="false">z@ccolley.com</a>. CV available on request.</p>

				<h2>GitHub</h2>
				<p>A lot of my time is spent coding and <a href="http://www.github.com/zaccolley" target="_blank" contenteditable="false">push a lot online </a>. This site <a href="http://www.github.com/zaccolley/sight" target="_blank" contenteditable="false">is there</a> too!
				<span id="githubrepos">I have a number of repos using different languages at the moment. :¬)</span></p>

				<h2>Twitter</h2>
				<p>A stream of consciousness in the form of <a href="http://www.twitter.com/zaccolley" target="_blank" contenteditable="false">tweets</a>.</p>

				<h2>Last.fm</h2>
				<p><span id="mostrecenttrack"></span>I'm sort of into <a id="mostlistenedartist" href='http://www.last.fm/music/Daft+Punk' target='_blank' contenteditable='false'>Daft Punk</a> at the moment but I <a href="http://www.last.fm/user/ZacColley" target="_blank" contenteditable="false">listen to</a> a lot more too!</p>

				<h2>LinkedIn</h2>
				<p>I'm also <a href="http://uk.linkedin.com/in/zaccolley" target="_blank" contenteditable="false">here apparently</a>&hellip;</p>

			</section>

			<section id="workcontent">

				<p>You can find examples of my code <a href="http://www.github.com/zaccolley" target="_blank" contenteditable="false">over on GitHub</a>. Below are also some projects I've worked on.</p>

				<h2>Code</h2>
				
				<ul>
					<li><span class="inactive" title="Coming soon&hellip; ;¬)">UPRacing Website</span> &bull; Design <em>Dan Gordon &amp; Matt Jackson.</em></li>
				</ul>

				<h2>Visuals</h2>
				
				<ul>
					<li><span class="inactive" title="Coming soon&hellip; ;¬)">UPRacing Engine Stats App</span> &bull; Intial branding and style <em>Dan Gordon.</em></li>
					<li><a href="http://minecraftexplore.tumblr.com" target="_blank" contenteditable="false">Minecraft Explore</a> &bull; <em>No longer updated.</em> :¬(</li>
				</ul>

				<h2>Both!</h2>
				
				<ul>
					<li><span class="inactive" title="Coming soon&hellip; ;¬)">University of Portmouth Computing Society's Website</span> &bull; Lead back-end <em>Rich Solomou.</em></li>
					<li><a href="http://www.zaccolley.com/uni/webf1" contenteditable="false">WEBF1 C/W</a> &bull; Web Foundations University Coursework</li>
				</ul>

			</section>

			<section id="stuffcontent">

				<p>Some experiments, stuff and other junk. c|:¬P</p>

				<h2>Talks</h2>
				
				<ul>
					<li><a href="http://www.zaccolley.com/stuff/sexycsstalk/" target="_blank" contenteditable="false">SEXY CSS</a> &bull; Slides for a small <em>UoPCS</em> talk I done did.</li>
				</ul>

				<h2>CSS Experiments</h2>

				<ul>
					<li><a href="http://www.zaccolley.com/stuff/foraaron/" target="_blank" contenteditable="false">Gameboy</a> &bull; Birthday present for a friend. <em>Only works in Chrome - Sorry!</em> :¬$</li>
					<li><a href="http://www.zaccolley.com/uni/forrich" target="_blank" contenteditable="false">Birthday Cake</a> &bull; Another present. <em>Check dem flickering candles.</em></li>
					<li><a href="http://zaccolley.com/christmas2012/" target="_blank" contenteditable="false">Christmas Card Maker</a> &bull; Made with my festive bro.</li>
				</ul>
				
			</section>

		</section>
	</section>
</article>
<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
<script src="http://code.jquery.com/ui/1.10.2/jquery-ui.js"></script>
<script type="text/javascript" src="js/scripts.js"></script>
</body>
</html>