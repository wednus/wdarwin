/**
 * \file Creature.js Wednus Creature class
 *
 * This file contains the class definition of the W.Creature.
 * @author Sundew H. Shin
 * @version 0.1.1
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
  // creature ID; -1 for wall
  this.id = 0;
  // position coordinate on a world
  this.col = 0;
  this.row = 0;
  this.act = 'hide';
  this.actLast = '';
  this.dir = 'south';
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
  // internal reference only (need to be private)
  this.actQueue = [];
  this.skills = [];
  this.add(new W.Skill());
  // visual components
  this.img = document.createElement('img');
  this.img.title = this.id + ' : '+ this.name;
  this.img = W.style('img', 'position:absolute;left:-1000px;');
  this.body = W.style('div', 'position:absolute;top:0px;left:0px;overflow:hidden;background:navy;');
  this.body.appendChild(this.img);

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

  // extend/override constructor w/ passed args object
  for(var i in args)
    eval('this.'+ i +' = args["'+ i +'"];');
};


/**
 * add a skill, an animation
 *
 * @param {Skill} skill object with animation information; e.g. W.Skill
 * @note 'a skill' is an object with definitions of an animation
 * @test <a href='../../test/Creature_add.html'>add a skill (walking)</a>
 * @test <a href='../../test/walkaround_reymond.html'>add creature (1-frame: animation gif)</a>
 * @test <a href='../../test/walkaround_chocobo.html'>add creature (4-frame)</a>
 * @test <a href='../../test/walkaround_villager.html'>add creature (4-frame)</a>
 * @test <a href='../../test/walkaround_rock_cn_sprites.html'>add creature (6-frame)</a>
 * @test <a href='../../test/walkaround_lemming.html'>add creature (8-frame)</a>
 * @test <a href='../../test/walkaround_gorgon.html'>add creature (4 uwidth/uheight sprite)</a>
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
  var clone = new W.Creature();
  for(var i in this){
    // exclude the HTMLElement members for preventing obj cross referencing
    if(i != 'body' && i != 'img')
      eval('clone.'+ i +' = this["'+ i +'"];');
  }
  return clone;
};


/**
 * perform current action
 *
 * @param {String} name of the target skill
 * @test <a href='../../test/place_occupying_hori.html'>test changeCol</a>
 * @test <a href='../../test/place_occupying_vert.html'>test changeRow</a>
 * @test <a href='../../test/place_occupying.html'>test changeCol/changeRow</a>
 */
W.Creature.prototype.action = function(act){var self = this;
  if(act) this.act = act;
  // handle actions not require any animation change
  if(this.act == 'hide' || this.act == 'still') return;
  if(this.turnTo(this.act)){
    checkOutNextAct();
  }
  var skill = this.skills[this.act];
  // change the animation sprite only if it's needed
  if(skill.img != this.img.src)
    this.img.src = skill.img;



  // manage sprite
  skill.animate();

  // move creature
  var bodyPos = 0;
  if(this.dir == 'north' || this.dir == 'south'){
    bodyPos = parseInt(this.body.style.top);
  }else bodyPos = parseInt(this.body.style.left);

  switch(this.dir){
    case 'north':
      bodyPos -= this.speed;
      if(bodyPos >  -this.speed){
        changeRow(bodyPos);
      }else this.wall();
      break;
    case 'south':
      bodyPos += this.speed;
      if(bodyPos < this.maxTop + this.speed){
        changeRow(bodyPos);
      }else this.wall();
      break;
    case 'east':
      bodyPos += this.speed;
      if(bodyPos < this.maxLeft + this.speed){
        changeCol(bodyPos);
      }else this.wall();
      break;
    case 'west':
      bodyPos -= this.speed;
      if(bodyPos > -this.speed){
        changeCol(bodyPos);
      }else this.wall();
      break;
  };

  // TODO handle multi-unit creatures
  function changeCol(left){var value = 0;
    left = (left < 0)?0:left;
    if(self.dir == 'east'){
      value = Math.ceil(left / self.world.unit);
    }else if(self.dir == 'west') value = Math.floor(left / self.world.unit);

    if(value != self.col){
      //self.moveTo(self.row, value);
      var other = self.world.at(self.row, value);
      if(other){
        self.other(other);  // other creature detected
        return;
      }else{
        self.world.matrix[self.row][value] = self.id;
        self.world.matrix[self.row][self.col] = -1;
        self.col = value;  // change col prop.
        checkOutNextAct();
      }
    }
    self.body.style.left = left +'px';  // move body
  };

  window.status = 'act:' + self.act + ', dir:' + self.dir +', top:'
    + self.body.style.top +', left:'+ self.body.style.left;


  function changeRow(top){var value = 0;
    top = (top < 0)?0:top;
    if(self.dir == 'south'){
      value = Math.ceil(top / self.world.unit);
    }else if(self.dir == 'north') value = Math.floor(top / self.world.unit);

    if(value != self.row){
      var other = self.world.at(value, self.col);
      if(other){
        self.other(other);  // other creature detected
        return;
      }else{
        self.world.matrix[value][self.col] = self.id;
        self.world.matrix[self.row][self.col] = -1;
        self.row = value;  // change row prop.
        // adjust zIndex
        self.body.style.zIndex = value;
        checkOutNextAct();
      }
    }
    self.body.style.top = top +'px';  // move body
  };

  function checkOutNextAct(){
    // manage actionQueue
    if(self.actQueue.length != 0){ // check any reserved act
      self.act = self.actQueue.shift(); // check out next action
    }else self.act = 'still';
  };
};


/**
 * move onto the given coordinate
 *
 * @param {Integer} row row
 * @param {Integer} col colume
 */
W.Creature.prototype.moveTo = function(row, col){
  var other = this.world.at(row, col);
  if(!other){
    this.world.matrix[row][col] = this.id;
    this.world.matrix[this.row][this.col] = -1;
    this.row = row;  // change col prop.
    this.col = col;  // change col prop.

    // manage actionQueue
    if(this.actQueue.length != 0)  // check any reserved act
      this.act = this.actQueue.shift();  // check out next action
  }else this.other(other);  // other creature detected
};


/**
 * turn to the specified direction
 *
 * @param {String} op operation to execute
 * @return {Boolean} true if the op commands direction change
 * @note handles only following actions:
 * 'rturn,left,right,backward,north,east,south,west'
 */
W.Creature.prototype.turnTo = function(op){
  switch(op){
    case 'rturn':
      var direction  = ['north', 'east', 'south', 'west'];
      this.dir = direction[Math.floor(Math.random() * 4)];
      return true;
    case 'left':
      switch(this.dir){
        case 'north': this.dir = 'west';  break;
        case 'south': this.dir = 'east';  break;
        case 'east':  this.dir = 'north'; break;
        case 'west':  this.dir = 'south'; break;
      };
      return true;
    case 'right':
      switch(this.dir){
        case 'north': this.dir = 'east';  break;
        case 'south': this.dir = 'west';  break;
        case 'east':  this.dir = 'south'; break;
        case 'west':  this.dir = 'north'; break;
      };
      return true;
    case 'backward':
      switch(this.dir){
        case 'north': this.dir = 'south'; break;
        case 'south': this.dir = 'north'; break;
        case 'east':  this.dir = 'west';  break;
        case 'west':  this.dir = 'east';  break;
      };
      return true;
    case 'north':
    case 'east':
    case 'south':
    case 'west':
      return true;
    default:  // operation not commnads any direction change
      return false;
  };
};


/**
 * meet other creature
 *
 * @param {Creature} other the creature this creature encountered
 */
W.Creature.prototype.contact = function(other){
  this.reserve(this.ifWall);
};


/**
 * meet other creature - 2
 *
 * @param {Creature} other the creature this creature encountered
 * @note current implementation: treat as wall
 */
W.Creature.prototype.other = function(other){
  this.reserve(this.ifWall);
};


/**
 * face the wall
 */
W.Creature.prototype.wall = function(){
  this.reserve(this.ifWall);
};


/**
 * do something (op)
 *
 * @param {String} op the name of operation
 */
W.Creature.prototype.does = function(op){
  this.act = op;
};


/**
 * play series of actions
 *
 * @param {String} scenario comma-splited series of actions
 * @test <a href='../../test/playScenario.html'>play reserved actions</a>
 */
W.Creature.prototype.play = function(scenario){
  scenario += '';
  this.actQueue = scenario.split(',');
};


/**
 * researve series of actions
 *
 * @param {String} scenario comma-splited series of actions
 * @note merging_two_arrays.html
 */
W.Creature.prototype.reserve = function(scenario){
  // stringify the arg
  scenario += '';
  this.actQueue = this.actQueue.concat(scenario.split(','));
};