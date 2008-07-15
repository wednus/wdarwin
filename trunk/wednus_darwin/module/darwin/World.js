/**
 * \file World.js   Wednus World class
 *
 * This class defines the world with 2D matrix of objects (creatures).
 * Performs followings:
 * - 1. prepare the WPS basic elements (.core, .body)
 * - 2. prepare for Oracle class (.tick() w/ internal delaying mechanism)
 * - 3. build/manage matrix (wall, insert, erase..)
 * - 4. manage creature ID
 * - 5. debugging elements (clock, grid)
 *
 * creature object requires one method:
 * - .action - per each tick(), the world runs this method of each creature included at once
 * - .makeControl - true/false: assigns this creature controllable; one for each world
 *
 * creature object requires one properties:
 * - .control - refer to detect whether the creature is controllable
 *
 * @author Sundew H. Shin
 * @version 0.2.0
 */

/**
 * World class
 *
 * This class implements a prototype of HTMLElement object containers. (world)
 * - .unit: defines the size (pixel) of squire unit space of the world
 * - .cols/.rows: number of unit-sized cells
 * @param {Object} args extend/override constructor w/ this passed args object
 * @test <a href='../../test/World.html'>default construction</a>
 * @test <a href='../../test/World_4by4.html'>creature a 4*4 world</a>
 */
W.World = function(args){var self = this;
  // .core: position
  this.top = 0;
  this.left = 0;
  // .core: dimension difinition
  this.unit = 24;
  this.cols = 1;
  this.rows = 1;
  // creature default appearance position
  // define background if provided
  this.image = null;
  // begin dir/position
  this.bdir = 'south';
  this.brow = 0;
  this.bcol = 0;
  // status properties
  //this.ready = true;  // ready status
  this.stop = false;  // stop world
  // containers
  this.creatures = [];
  this.matrix = [];  // creature matrix

  // extend/override constructor w/ passed args object
  for(var i in args)
    eval('this.'+ i +' = args["'+ i +'"];');

  // WPS components: build body & set background
  this.width = this.cols * this.unit;
  this.height = this.rows * this.unit;  // will be decided at .onload
  this.body = W.style('div', 'top:0px;left:0px;width:'+ (this.width + this.left)
    +'px;height:'+ (this.height + this.top) +'px;zIndex:1;overflow:hidden;'
    +'position:absolute');
  // expand the core to cover the background image area
  if(this.image)
    this.fitToBackground();
  // build core
  this.core = W.style('div', 'top:'+ this.top +'px;left:'+ this.left +'px;width:'
    + this.width +'px;height:'+ this.height +'px;zIndex:1;overflow:hidden;'
    +'position:absolute');
  this.body.appendChild(this.core);

  // build creature matrix
  this.buildMatrix = function(rows, cols){
    for(var i = 0; i < rows; ++i){
      this.matrix[i] = [];
      for(var j = 0; j < cols; ++j)
        this.matrix[i][j] = -1;
    }
  };
  this.buildMatrix(this.rows, this.cols);
};


/**
 * return creature on the given coordinate
 *
 * @param {Number} row given row
 * @param {Number} col given col
 * @return {Creature} creature if there is a creature on the given coordinate;
 * otherwise, return W.World.wall (creature ID: -2).
 */
W.World.prototype.at = function(row, col){
/*
  if(row < this.rows && col < this.cols)
    return this.matrix[row][col];
  return false;
*/
  var id = this.matrix[row][col];
  //window.status = 'row:'+ row +', col:'+ col;
  if(id == -1) return false;  // empty (default)
  if(id == -2) return this.wall;  // wall
  var creature;
  for(var i = 0; i < this.creatures.length; ++i){
    creature = this.creatures[i];
    if(creature.row == row && creature.col == col)
    return creature;
  }
  return false;
};


/**
 * erase creature from the matrix
 *
 * @param {Number} id the id of a creature to be erased from the world
 */
W.World.prototype.erase = function(id){
  var creature = this.creatures[id];
  this.matrix[creature.row][creature.col] = -1;
  this.creatures[id] = -1;
};


/**
 * Oracle's requirement: .tick() method taking the generated periodic events
 * @test <a href='../../test/World_with_Oracle.html'>World with Oracle</a>
 */
W.World.prototype.tick = function(){
  // @TODO: self.ready = false;
  for(var i = 0; i < this.creatures.length; ++i)
    //if(this.creatures[i] != -1)
      this.creatures[i].action();
};


/**
 * add creature into the world
 *
 * @param {Creature} creature a creature to be added
 * @param {Number} row the row to be inserted on
 * @param {Number} col the col to be inserted on
 * @return {Creature} this creature with updated properties (mostly dimension info)
 * @test <a href='../../test/World_get_into_Oracle.html'>add a World into an Oracle</a>
 */
W.World.prototype.add = function(creature, row, col){
  // add .world property to the creature
  creature.world = this;
  creature.row = row?row:creature.row;
  creature.col = col?col:creature.col;
  // adjust the creature dimension
  if(creature.resize)
    creature.resize(this.unit);
  // adjust the creature position
  creature.body.style.top = (creature.row * this.unit) +'px';
  creature.body.style.left = (creature.col * this.unit) +'px';
  // notify the creature the workspace limit
  creature.maxTop = this.height - creature.height;
  creature.maxLeft = this.width - creature.width;
  // assign the creature id
  creature.id = this.creatures.length;
  this.creatures[this.creatures.length] = creature;
  // register creature
  this.core.appendChild(creature.body);
  this.matrix[creature.row][creature.col] = creature.id;
  return creature;
};


/**
 * set the wall
 *
 * @param {String} bitmask string with wall data
 * @test <a href='../../test/World_with_wall.html'>World with wall</a>
 */
W.World.prototype.set = function(bitmask){
  // define wall id
  if(typeof this.wall == 'undefined')
    this.wall = {id: -2};
  var data = bitmask.split(':');
  data[1] = data[1].split(',');
  for(var i = 0; i < data[1].length; ++i)
    this.matrix[data[0]][data[1][i]] = this.wall.id;
};


/**
 * set background of the world
 *
 * @param {String} bg value for body.style.background<br>color or the URL for the image source
 */
W.World.prototype.background = function(bg){
  this.body.style.background = bg;
};


/**
 * expand the .core to fit the .body area
 * @test <a href='../../test/World_full.html'>stretched to fit to the world.body</a>
 */
W.World.prototype.full = function(){var self = this;
  this.cols = Math.floor(W.width / this.unit);
  this.width = this.cols * this.unit;
  this.core.style.width = this.body.style.width = this.width +'px';

  this.rows = Math.floor(W.height / this.unit);
  this.height = this.rows * this.unit;
  this.core.style.height = this.body.style.height = this.height +'px';

  //self.body.style.height = height +'px';
  for(var i = 0; i < this.creatures.length; ++i){
    var creature = this.creatures[i];
    creature.maxTop = this.height - this.top - creature.height;
    creature.maxLeft = this.width - this.left  - creature.width;
  }

  //window.status = 'self.rows:'+ this.rows +', self.cols:'+ self.cols +', width:'+ width +', height:'+ height;
  this.buildMatrix(this.rows, this.cols);

  //document.body.appendChild(W.style('table', 'width:'+ this.width +';height:'+ this.height));
  document.body.appendChild(W.style('table', 'width:100px;height:100px'));
};


/**
 * show grid
 *
 * @param {Boolean} isOn true to turn on the grid display on .core<br>otherwise, false
 * @test <a href='../../test/World_showGrid.html'>reveal grid on/off</a>
 */
W.World.prototype.showGrid = function(isOn){
  if(isOn){
    this.core.style.background =  'url('+ W.path +'module/darwin/image/grid_'+ this.unit +'.gif)';
  }else this.core.style.background = "";
};


/**
 * fit the .core to the background image
 * @test <a href='../../test/World_with_background.html'>World with background image</a>
 * @test <a href='../../test/World_with_background_32unit.html'>World with background image (32px)</a>
 */
W.World.prototype.fitToBackground = function(){var self = this;
  // detect image size by pre-loading
  var backPath = W.path + this.image;
  var back = new Image();
  back.src = backPath;
  // for Safari or other browsers not ensure finishing image loading as src declaration
  // http://dhtmlforsafari.blogspot.com/2007/06/failure-classic-method-of-image-size.html
  if(back.width == 0){
    back.onload = function(){
      W.style(self.body, 'width:'+ this.width +'px;height:'+ this.height +'px');
    };
  }
  W.style(this.body, 'width:'+ back.width +'px;height:'+ back.height +'px;');
  this.body.style.background = 'url('+ backPath +')';
};