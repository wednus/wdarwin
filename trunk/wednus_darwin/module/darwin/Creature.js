/**
 * \file Creature.js Wednus Creature class
 *
 * This file contains the class definition of the W.Creature.
 * @author Sundew H. Shin
 * @version 0.2.1
 */

/**
 * Creature class
 *
 * This class implements a prototype of simulated organic objects. (creature)
 * - .uwidth/.uheight/.udepth: number of unit-sized cells creature physically occupies
 * @param {Object} args extend/override constructor w/ this passed args object
 * @test <a href='../../test/Creature.html'>default construction</a>
 */
W.Creature = function(args){var self = this;
  // animation image offset
  this.top = 0;
  this.left = 0;
  // actual location on a place
  this.top_onPlace = 0;
  this.left_onPlace = 0;
  // creature ID; -2 for wall
  this.id = 0;
	this.name = 'no name';
  // position coordinate on a world
  this.col = 0;
  this.row = 0;
  // u(nit) size; 1 unit = 1 * world.unit
  this.uwidth = 1;
  this.uheight = 1;
  this.udepth = 1;
  // internal reference only (need to be private)
  this.frame = 0;
  this.maxTop = 0;
  this.maxLeft = 0;
  // sprite animation speed - the smaller, the smoother animation (more CPU time)
  this.speed = 6;
  this.skills = [];
	this.events = [];
  this.add(new W.Skill());
  this.act = 'hide';
  this.dir = 'south';
	// control focus on/off
	this.focus = false;
  // visual components
  this.img = document.createElement('img');
  this.img.title = this.id + ' : '+ this.name;

  // extend/override constructor w/ passed args object
  for(var i in args)
    eval('this.'+ i +' = args["'+ i +'"];');

  this.img = W.style('img', 'position:absolute;left:-1000px;');
  this.body = W.style('div', 'position:absolute;overflow:hidden;');
  this.body.appendChild(this.img);
  // attach event handlers
  this.body.onclick = function(){self.algo('on_click');};
  this.body.onmouseout = function(){self.algo('on_mouseout');};
  this.body.onmouseover = function(){self.algo('on_mouseover');};

  /**
   * resize the creature
   *
   * @param {Number} uwidth unit width; 1 unit = 1 * world.unit
   * @param {Number} uheight unit height; 1 unit = 1 * world.unit
   */
  this.resize = function(unit){
    this.width = this.uwidth * unit;
    this.height = this.uheight * unit;
    this.depth = this.udepth * unit;
    this.body.style.width = this.width +'px';
    this.body.style.height = this.height +'px';
  };

	/**
	 * stop moving
	 */
	this.stop = function(){
	  this.speed_backup = this.speed;
	  this.speed = 0;
	};
		
	/**
	 * resume the latest action (skill) in backup speed
	 */
	this.resume = function(){
	  this.speed = this.speed_backup;
	};
		
	/**
	 * talk
	 */
	this.talk = function(msg){
	  this.world.messages[this.world.messages.length] = this.name +': '+ msg;
	};
};


/**
 * add a skill, an animation
 *
 * @param {Skill} skill object with animation information; e.g. W.Skill
 * @note 'a skill' is an object with definitions of an animation
 * @test <a href='../../test/Creature_add.html'>add a skill (walking)</a>
 * @test <a href='../../test/walkaround_reymond.html'>add creature (1-frame: animation gif)</a>
 */
W.Creature.prototype.add = function(skill){
  // allow skill to refer creature it added to
  skill.creature = this;
  this.skills[skill.name] = skill;
};


/**
 * clone this creature and return the clone
 *
 * @return {Creature} creature the product of cloning
 * @test <a href='../../test/walkaround_lemmings.html'>add creature with cloning</a>
 * @test <a href='../../test/clones_on_iphone.html'>clones on iPhone-sized world</a>
 */
W.Creature.prototype.clone = function(){
	var clone = new W.Creature({uwidth:this.uwidth,uheight:this.uheight});
  // copy skills
  for(var i in this.skills)
		clone.add(new W.Skill(this.skills[i]));
  // copy events
	clone.events = this.events;
	  
  //eval('clone.events["'+ i +'"] = this.events["'+ i +'"]');
  // copy other elements (e.g. Creature.algo)
  for(var i in this){
    // exclude the HTMLElements/Objects for preventing obj cross referencing
    if(i != 'body' && i != 'img' && i != 'skills')
      eval('clone.'+ i +' = this["'+ i +'"]');
  }
  return clone;
};


/**
 * perform current action
 *
 * @test <a href='../../test/Creature_algo.html'>Creature.algo()</a>
 * @test <a href='../../test/place_occupying.html'>test changeCol/changeRow</a>
 */
//W.Creature.prototype.action = function(act){var self = this;
W.Creature.prototype.action = function(){var self = this;
  // manage sprite
  this.skills[this.act].animate();
  // do nothing on zero speed
  if(this.speed <= 0) return;

  // move creature
  var bodyPos, coor;
  if (this.dir == 'north' || this.dir == 'south') {
    bodyPos = this.top_onPlace; //parseInt(this.body.style.top);
  }else{
    bodyPos = this.left_onPlace; //bodyPos = parseInt(this.body.style.left);
  }
  // handle dir
  switch(this.dir){
    case 'north':
    case 'west':
      bodyPos = ((bodyPos - this.speed) < 0)?0:bodyPos - this.speed;
      //coor = parseInt((bodyPos - this.top) / this.world.unit);
      break;
    case 'south':
      bodyPos = ((bodyPos + this.speed) > this.maxTop)?this.maxTop:bodyPos+this.speed;
      break;
    case 'east':
      bodyPos = ((bodyPos + this.speed) > this.maxLeft)?this.maxLeft:bodyPos+this.speed;
      //coor = parseInt((bodyPos - this.left) / this.world.unit);
      break;
  };
  // change coor if necessary
  coor = parseInt(bodyPos / this.world.unit);
  if(this.dir == 'north' || this.dir == 'south'){
    if (this.row != coor) changeCoor(coor, this.col);
    this.top_onPlace = moveTo(bodyPos, 1, this.place.vertScrollStart, this.place.vertScrollEnd);
  }else{
    if(this.col != coor) changeCoor(this.row, coor);
    this.left_onPlace = moveTo(bodyPos, 0, this.place.horiScrollStart, this.place.horiScrollEnd);
  }

  function moveTo(pos, isVerticalMove, start, end){
    var grid, target, halfWorld, onWall = false;
    if (isVerticalMove){
      grid = self.place.grid.style.top;
      target = self.body.style.top;
      halfWorld = self.halfHeight;
      if(pos == 0 || pos == self.maxTop) onWall = true;
    }else{
      grid = self.place.grid.style.left;
      target = self.body.style.left;
      halfWorld = self.halfWidth;
      if(pos == 0 || pos == self.maxLeft) onWall = true;
    }     
    // scroll place if necessary
    if (pos > start && pos <= end) {
      grid = -(pos - halfWorld) + 'px';
      //return (pos - parseInt(grid));
      return pos;
    }
    
    target = pos + 'px'; // move body
    window.status = 'target:'+ target +', pos:'+ pos;
    if(onWall) self.algo('on_wall');
    return pos;
  };

  //@TODO handle multi-unit creatures
  function changeCoor(row, col){
    var other = self.place.at(row, col);
    // other creature detected
    if (other) {
      self.algo('on_creature', other); // other creature detected
      return;
    }
    var matrix;
    matrix = self.place.matrix;
    matrix[row][col].cell.style.background = 'navy';
    matrix[row][col].id = self.id;
    matrix[self.row][self.col].cell.style.background = 'transparent';
    matrix[self.row][self.col].id = -1;
    self.row = row; // change row prop.
    self.col = col; // change col prop.
    // adjust zIndex
    self.body.style.zIndex = row;
    // exec creature algorithm
    self.algo('on_nothing', {row:row, col:col});
  };  
};


/**
 * relative-dir to absolute-dir 
 *
 * @param {String} rDir relative dir e.g. left/right/front/rear/random
 * @return {String} abs direction, otherwise, return false
 * @note handles only following actions:
 * 'rturn,left,right,backward,north,east,south,west'
 */
W.Creature.prototype.getAbsDir = function(rDir){
  var numOfTurns;
  var absDir = ['north', 'east', 'south', 'west'];
  var relDir = ['front', 'right', 'rear', 'left'];
  // bypass it if the argument is absDir
  if (absDir.indexOf(rDir) != -1)
    return rDir;
  // handle random turn
  if(rDir == 'random')
     return absDir[Math.floor(Math.random() * 4)];
  // manage circular array
  numOfTurns = absDir.indexOf(this.dir);
  if (numOfTurns != -1) {
  	for (var i = 0; i < numOfTurns; ++i) {
  		var first = absDir.shift();
  		absDir.push(first);
  	}
    if(relDir.indexOf(rDir == -1)) return false;
  	return absDir[relDir.indexOf(rDir)];
  }
	return false;
};  


/**
 * is A on B? (checks existance)
 * 
 * @param {Creature} A a creature (object)
 * @param {String} B direction ('left/right/front/rear/random, and north/south/west/east')
 * or coordinate ('0:1')
 * @TODO handle edge conditions (e.g. top/bottom)
 */
W.Creature.prototype.isAonB = function(A, B){
  // handle direct coordination
  if(B.split(':').length != 0){
    var coor = B.split(':');
    return (A == this.world[coor[0]][coor[1]]);
  }
  // convert relative dir.('front',..) to absolute dir.('north',..)
  while(true){
    switch(B){
      case 'north': return (A == this.place[this.col][--this.row]);
      case 'east': return (A == this.place[++this.col][this.row]);
      case 'south': return (A == this.place[this.col][++this.row]);
      case 'west': return (A == this.place[--this.col][this.row]);
      case 'front':
      case 'right':
      case 'rear':
      case 'left': B = this.getAbsDir(B);
    }
  };
  return true;
};


/**
 * {Creature} does {Skill} to the target {Creature}
 * 
 * @param {Skill} a skill (object)
 * @param {Object} the target direction{String} or creature{Creature}
 */
W.Creature.prototype.does = function(skill, target){
	// check the target is a dir
	var absDir = this.getAbsDir(target);
	if(absDir){
    this.dir = absDir;		
  }
	this.act = skill.name;
	if(typeof skill.speed != 'undefined')
	  this.speed = skill.speed;
};


/**
 * algorithm
 */
W.Creature.prototype.algo = function(event, arg){
	var evt = this.events[event];
	if (typeof evt != 'undefined') {
  	evt(arg);
  };
};


/**
 * control
 */
W.Creature.prototype.control = function(isControllable){var self = this;
  if(!isControllable){
    this.focus = false;
  }else{
    this.focus = true;
    W.event(document, 'onkeydown', onkeydownHandler);
    W.event(document, 'onkeyup', onkeyupHandler);
	};

	var keys = [];
	function onkeydownHandler(e){if(!e) e = window.event;
    keys[e.keyCode] = true;
    if(self.focus) self.algo('on_key', keys);
	};
	
	function onkeyupHandler(e){if(!e) e = window.event;
    keys[e.keyCode] = false;
    if(self.focus) self.algo('on_key', keys);
	};
};
