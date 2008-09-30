/**
 * \file Creature.js Wednus Creature class
 *
 * This file contains the class definition of the W.Creature.
 * @author Sundew H. Shin
 * @version 0.2.0
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
  this.add(new W.Skill());
  this.act = 'hide';
  this.dir = 'south';
  // creature-algorithm
  this.algo = function(){};
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
      eval('clone.'+ i +' = this["'+ i +'"]');
  }
  return clone;
};


/**
 * perform current action
 *
 * @test <a href='../../test/Creature_algo.html'>Creature.algo()</a>
 * @test <a href='../../test/place_occupying_hori.html'>test changeCol</a>
 * @test <a href='../../test/place_occupying_vert.html'>test changeRow</a>
 * @test <a href='../../test/place_occupying.html'>test changeCol/changeRow</a>
 */
//W.Creature.prototype.action = function(act){var self = this;
W.Creature.prototype.action = function(){var self = this;
  // manage sprite
  this.skills[this.act].animate();
  // move creature
  var bodyPos = 0;
  if(this.dir == 'north' || this.dir == 'south'){
    bodyPos = parseInt(this.body.style.top);
  }else bodyPos = parseInt(this.body.style.left);
  // handle dir
  switch(this.dir){
    case 'north':
      bodyPos -= this.speed;
      if(bodyPos >  -this.speed){
        changeRow(bodyPos);
      }else this.algo(true); // hit the edge
      break;
    case 'south':
      bodyPos += this.speed;
      if(bodyPos < this.maxTop + this.speed){
        changeRow(bodyPos);
      }else this.algo(true);
      break;
    case 'east':
      bodyPos += this.speed;
      if(bodyPos < this.maxLeft + this.speed){
        changeCol(bodyPos);
      }else this.algo(true);
      break;
    case 'west':
      bodyPos -= this.speed;
      if(bodyPos > -this.speed){
        changeCol(bodyPos);
      }else this.algo(true);
      break;
  };

  //@TODO handle multi-unit creatures
  function changeCol(left){var value = 0;
    left = (left < 0)?0:left;
    if(self.dir == 'east'){
      value = Math.ceil(left / self.world.unit);
    }else if(self.dir == 'west') value = Math.floor(left / self.world.unit);
    // on column change
    if(value != self.col){
      var other = self.world.at(self.row, value);
      // other creature detected
      if(other){
        self.algo(other);
        return;
      }else{
        // exec creature algorithm
        self.algo();
        self.world.matrix[self.row][value] = self.id;
        self.world.matrix[self.row][self.col] = -1;
        self.col = value;  // change col prop.
        //if(!checkOutNextAct()) return;
      }
    }
    self.body.style.left = left +'px';  // move body
  };

  function changeRow(top){var value = 0;
    top = (top < 0)?0:top;
    if(self.dir == 'south'){
      value = Math.ceil(top / self.world.unit);
    }else if(self.dir == 'north') value = Math.floor(top / self.world.unit);
    // on row change
    if(value != self.row){
      var other = self.world.at(value, self.col);
      if(other){
        self.algo(other);  // other creature detected
        return;
      }else{
        // exec creature algorithm
        self.algo();
        self.world.matrix[value][self.col] = self.id;
        self.world.matrix[self.row][self.col] = -1;
        self.row = value;  // change row prop.
        // adjust zIndex
        self.body.style.zIndex = value;
      }
    }
    self.body.style.top = top +'px';  // move body
  };
};


/**
 * relative-dir to absolute-dir 
 *
 * @param {String} rDir relative dir e.g. left/right/front/rear/random
 * @return {Boolean} true if the op commands direction change
 * @note handles only following actions:
 * 'rturn,left,right,backward,north,east,south,west'
 */
W.Creature.prototype.getAbsDir = function(rDir){
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
  for (var i = 0; i < numOfTurns; ++i) {
    var first = absDir.shift();
    absDir.push(first);
  }
  return absDir[relDir.indexOf(rDir)];
};  


/**
 * do A to B
 * 
 * @param {Skill} A a skill
 * @param {Object} B argument for the action, e.g. direction, Creature...
 */
W.Creature.prototype.doAtoB = function(A, B){
  // do skill-specific action
  A.to(B);
  this.act = A.name;
};


/**
 * is A on B?
 * 
 * @param {Creature} A a creature (object)
 * @param {String} B direction ('left/right/front/rear/random, and north/south/west/east')
 * or coordinate ('0:1')
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
      case 'north': return (A == this.world[this.col][--this.row]);
      case 'east': return (A == this.world[++this.col][this.row]);
      case 'south': return (A == this.world[this.col][++this.row]);
      case 'west': return (A == this.world[--this.col][this.row]);
      case 'front':
      case 'right':
      case 'rear':
      case 'left': B = this.getAbsDir(B);
    }
  };
};