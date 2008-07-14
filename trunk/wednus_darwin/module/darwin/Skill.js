/**
 * \file Skill.js Wednus Skill class
 *
 * This file contains the class definition of the W.Skill.
 * @author Sundew H. Shin
 * @version 0.1.1
 */

/**
 * Skill class
 *
 * This abstract class implements a prototype defining an animation action for
 * Creature.
 * @param {Object} args extend/override constructor w/ this passed args object
 */
W.Skill = function(args){
  // default action
  this.name = 'hide';
  this.img = 'module/darwin/image/blank.gif';
  this.east = '0:0';
  this.west = '0:0';
  this.north = '0:0';
  this.south = '0:0';

  this.dir = 'south';  // current direction
  this.frame = 0;  // current frame
  // extend/override constructor w/ passed args object
  for(var i in args)
    eval('this.'+ i +' = args["'+ i +'"];');

  this.img = W.path + this.img;
  this.east = splitter(this.east);
  this.west = splitter(this.west);
  this.north = splitter(this.north);
  this.south = splitter(this.south);

  // split by comma
  function splitter(str){
    var tmp = str.split(',');
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
 * @test <a href='../../test/animation_reymond.html'>animate creature (1-frame: animation gif)</a>
 * @test <a href='../../test/animation.html'>animate creature (3-frame)</a>
 * @test <a href='../../test/animation_villager.html'>animate creature (4-frame)</a>
 * @test <a href='../../test/animation_rock_cn_sprites.html'>animate creature (6-frame)</a>
 * @test <a href='../../test/animation_lemming.html'>animate creature (8-frame)</a>
 */
W.Skill.prototype.animate = function(){
  // rotate frames
  if(this.frame >= this[this.dir].length - 1){
    this.frame = 0;
  }else ++this.frame;
  // flip frame
  this.creature.img.style.top = -this[this.creature.dir][this.frame].top +'px';
  this.creature.img.style.left = -this[this.creature.dir][this.frame].left +'px';
};
