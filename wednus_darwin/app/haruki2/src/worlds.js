// define an oracle
W.haruki.oracle = new W.Oracle();
W.haruki.oracle.showClock(true);

// define worlds
W.haruki.wBasement = new W.World({
   top: 8,
   left: 12,
   cols: 16,
   rows: 20,
   unit: 18,
   image: 'app/haruki2/images/background/underground.jpg'
});
W.haruki.wUnderMaze = new W.World({
   top: 210,
   left: 0,
   cols: 40,
   rows: 12,
   unit: 18,
   image: 'app/haruki2/images/background/underground_front.gif'
});
W.haruki.wForestCross = new W.World({
   top: 0,
   left: 8,
   cols: 26,
   rows: 20,
   image: 'app/haruki2/images/background/forest_cross.gif'
});
W.haruki.wHouseInForest = new W.World({
   top: 0,
   left: 8,
   cols: 26,
   rows: 20,
   image: 'app/haruki2/images/background/house_in_forest.gif'
});
W.haruki.wCage = new W.World({
   top: 0,
   left: 8,
   cols: 26,
   rows: 20,
   image: 'app/haruki2/images/background/cage.gif'
});

// define the world-pool
W.haruki.worlds = [W.haruki.wBasement, W.haruki.wUnderMaze, W.haruki.wForestCross,
  W.haruki.wHouseInForest, W.haruki.wCage];

// set the common parameters and add worlds to the oracle
for(var i in W.haruki.worlds){
  var world = W.haruki.worlds[i];
  world.showGrid(1);
	world.hide(1);
	world.delay = 7;
  W.haruki.oracle.add(world);
};

// handle the W.Oracle.init() after-effects
W.event(window, 'onload', function(){
  for (var i in W.haruki.worlds) {
    W.haruki.panel.appendChild(W.haruki.worlds[i].body);
    W.style(W.haruki.worlds[i].body, 'top:10px;left');
  }
});

W.haruki.worlds[1].hide(0);