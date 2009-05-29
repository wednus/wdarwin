// define an oracle
var oracle = new W.Oracle();
oracle.showClock(true);

var world = new W.World({
   width: 288,
   height: 360,
   delay: 6,
   unit: 24
});
oracle.add(world);

// define places
var places = [];
places[0] = new W.Place({
   image: 'app/haruki2/images/background/underground.jpg'
});
places[1] = new W.Place({
   image: 'app/haruki2/images/background/underground_front.gif'
});
places[2] = new W.Place({
   image: 'app/haruki2/images/background/forest_cross.gif'
});
places[3] = new W.Place({
   image: 'app/haruki2/images/background/house_in_forest.gif'
});
places[4] = new W.Place({
   image: 'app/haruki2/images/background/cage.gif'
});

// set the common parameters and add worlds to the oracle
for(var i = 0; i < places.length; ++i){
  world.add(places[i]);
  places[i].showGrid(1);
	places[i].hide(1);
	places[i].delay = 7;
};

// handle the W.Oracle.init() after-effects
W.event(window, 'onload', function(){
    panel.appendChild(world.body);
    W.style(world.body, 'top:10px;left');
});

places[1].hide(0);