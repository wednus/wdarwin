/**
 * \file Skill.js Wednus Skill class
 *
 * This file contains the class definition of the W.Skill.
 * @author Sundew H. Shin
 * @version 0.2.0
 */

/**
 * Skill class
 *
 * This abstract class implements a prototype defining an animation action for
 * Creature.
 * @param {Object} args extend/override constructor w/ this passed args object
 */
W.Skill = function(args){var self = this;
  // default action
  this.name = 'hide';
  this.img = 'module/darwin/image/blank.gif';
	this.repeat = false;
  this.east = '0:0';
  this.west = '0:0';
  this.north = '0:0';
  this.south = '0:0';
  this.dir = 'south';  // current direction
  this.frame = 0;  // current frame
  // place holder for creature which this skill added
  this.creature = {getAbsDir: new Function()};
  // do this skiil toward the given direction
  this.toward = function(dir){
    self.creature.dir = self.creature.getAbsDir(dir);
  }
  // extend/override constructor w/ passed args object
  for(var i in args)
    eval('this.'+ i +' = args["'+ i +'"];');
  this.east = splitter(this.east);
  this.west = splitter(this.west);
  this.north = splitter(this.north);
  this.south = splitter(this.south);
  // split by comma
  function splitter(arg){
		if(typeof arg.split == 'undefined')
		  return arg;
    var tmp = arg.split(',');
    var arr = [];
    for(var i = 0; i < tmp.length; ++i){
      tmp[i] = tmp[i].split(':');
      arr[i] = {};
      arr[i].top = tmp[i][0];
      arr[i].left = tmp[i][1];
    }
    return arr;
  };
};


/**
 * animate skill
 * @test <a href='../../test/animation_lemming.html'>animate creature (8-frame)</a>
 */
W.Skill.prototype.animate = function(){
  // rotate frames
  if(this.frame >= this[this.dir].length - 1){
    this.frame = 0;
  }else ++this.frame;
  //window.status = 'dir:'+ this.creature.dir +', this.frame:'+ this.frame;
  // change sprite image only if its needed
  if(this.creature.img.src != W.path + this.img)
    this.creature.img.src = W.path + this.img;
  // flip frame
  this.creature.img.style.top = -this[this.creature.dir][this.frame].top +'px';
  this.creature.img.style.left = -this[this.creature.dir][this.frame].left +'px';
};