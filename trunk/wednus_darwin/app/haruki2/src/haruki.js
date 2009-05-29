// define a creature
var haruki = new W.Creature({
  top: 0,//-34,
  left: 0,//-12,
  uwidth: 2,
  uheight: 2,
  speed: 5
});
haruki.control(true);

var sWalk = new W.Skill({name: 'walk', img: 'app/haruki2/images/creatures/haruki/walk.gif',
  north: '0:0,0:48,0:96',
  east:  '48:0,48:48,48:96',
  south: '96:0,96:48,96:96',
  west:  '144:0,144:48,144:96',
	speed: 5
});
// add skills
haruki.add(sWalk);

var sStop = new W.Skill({name: 'stop', img: 'app/haruki2/images/creatures/haruki/walk.gif',
  north: '0:48',
  east:  '48:48',
  south: '96:48',
  west:  '144:48',
	speed: 0
});
// add skills
haruki.add(sStop);
haruki.does(sStop);

var sAttack = new W.Skill({name: 'attack', img: 'app/haruki2/images/creatures/haruki/attack.gif',
  north: '0:0,0:48,0:96',
  east:  '48:0,48:48,48:96',
  south: '96:0,96:48,96:96',
  west:  '144:0,144:48,144:96',
  speed: 2
});
// add skills
haruki.add(sAttack);

// define the creature algorithm
haruki.algo = function(event, arg){var self = this;
  switch(event){
		case 'on_key':
		  applyKey(arg);
			break;
    case 'on_wall':
      break;
    case 'on_creature':
      break;
    case 'on_nothing':
      break;
    default:
  };
	
  function applyKey(keys){
		var numDownedKeys = 0;
    for(var i in keys){
      if(keys[i] != false){
        switch(i){
          case '37':
            self.dir = 'west';
						self.does(sWalk);
            break;
          case '38':
            self.dir = 'north';
            self.does(sWalk);
            break;
          case '39':
            self.dir = 'east';
            self.does(sWalk);
            break;
          case '40':
            self.dir = 'south';
            self.does(sWalk);
            break;
          case '32':
            self.does(sAttack);
            break;
        };
	      ++numDownedKeys;
	      //window.status = i;
      }
    };
		if(numDownedKeys == 0)
		  self.does(sStop);
  };
};

// add to the world
world.places[1].add(haruki, 1, 1);