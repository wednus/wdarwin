// define a creature
var tomoko = new W.Creature({
  top: -34,
  left: -12,
  uwidth: 2,
  uheight: 2,
  speed: 2
});

var sWalk_tomoko = new W.Skill({name: 'walk', img: 'app/haruki2/images/creatures/tomoko.gif',
  north: '0:0,0:48,0:96',
  east:  '48:0,48:48,48:96',
  south: '96:0,96:48,96:96',
  west:  '144:0,144:48,144:96'
});
// add skills
tomoko.add(sWalk_tomoko);
tomoko.does(sWalk_tomoko);

var sStop_tomoko = new W.Skill({name: 'stop', img: 'app/haruki2/images/creatures/tomoko.gif',
  north: '0:48',
  east:  '48:48',
  south: '96:48',
  west:  '144:48',
  speed: 0
});
// add skills
tomoko.add(sStop_tomoko);
//tomoko.does(sStop_tomoko);

// define the creature algorithm
tomoko.algo = function(event, arg){
  switch(event){
    case 'on_wall':
      this.does(sWalk_tomoko, 'random');
      break;
    case 'on_creature':
      this.does(sWalk_tomoko, 'random');
      break;
  };
};


// define a creature
var chicken = new W.Creature({
  top: -34,
  left: -12,
  uwidth: 2,
  uheight: 2,
  speed: 6
});

var sWalk_chicken = new W.Skill({name: 'walk', img: 'app/haruki2/images/creatures/chicken.gif',
  north: '0:0,0:48,0:96',
  east:  '48:0,48:48,48:96',
  south: '96:0,96:48,96:96',
  west:  '144:0,144:48,144:96'
})
// add skills
chicken.add(sWalk_chicken);
chicken.does(sWalk_chicken);

// define the creature algorithm
chicken.algo = function(event, other){
  switch(event){
    case 'on_wall':
      this.does(sWalk_chicken, 'random');
      break;
    case 'on_creature':
      this.does(sWalk_chicken, other.dir);
      break;
    case 'on_nothing':
      break;
    default:
  };
};

// add to the world
//world.places[1].add(tomoko, 2, 2);
//world.places[1].add(chicken, 6, 3);