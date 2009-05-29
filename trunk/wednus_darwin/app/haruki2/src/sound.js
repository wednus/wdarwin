soundManager.url = W.path +'app/haruki2/addons/soundmanagerv292a-20081224/swf'; // directory where SM2 .SWFs live

soundManager.onload = function(){
	var sWorld0 = soundManager.createSound({
	  id: 'sWorld0',
	  url: W.path +'app/haruki2/music/background/01 - The Place I\'ll Return To Someday.mp3'
	});
	
	var sWorld1 = soundManager.createSound({
	  id: 'sWorld1',
	  url: W.path +'app/haruki2/music/background/02 - Forgotten Memory In The Storm.mp3'
	});
	
  var sWorld2 = soundManager.createSound({
    id: 'sWorld2',
    url: W.path +'app/haruki2/music/background/03 - Strategy Conference.mp3'
  });

  /*
	sWorld0.play({
	  onfinish: function(){
	    this.play();
	  }
	});
	*/
};
// http://bluelaguna.net/music/ff9/mp3s.php
