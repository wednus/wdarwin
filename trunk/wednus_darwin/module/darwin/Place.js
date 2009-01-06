/**
 * \file Place.js   Wednus Place class
 *
 * This class defines the place with 2D matrix of objects (creatures).
 * Performs followings:
 * - 1. prepare the WPS basic elements (.core, .body)
 * - 2. prepare for Oracle class (.tick() w/ internal delaying mechanism)
 * - 3. build/manage matrix (wall, insert, erase..)
 * - 4. manage creature ID
 * - 5. debugging elements (clock, grid)
 *
 * creature object requires one method:
 * - .action - per each tick(), the world runs this method of each creature
 * included at once
 *
 * @author Sundew H. Shin
 * @version 0.0.1
 */

W.Place = function(args){var self = this;
  // .core: position
  this.top = 0;
  this.left = 0;
  this.cols = 1;
  this.rows = 1;
  // creature default appearance position
  // define background if provided
  this.image = null;
  this.wall = {id: -2};
  this.horiScrollStart = 0;
  this.horiScrollEnd = 0;
  this.vertScrollStart = 0;
  this.vertScrollEnd = 0;  
  // containers
  this.creatures = [];
  this.matrix = [];  // creatures matrix
  // extend/override constructor w/ passed args object
  for(var i in args)
    eval('this.'+ i +' = args["'+ i +'"];');

  // build grid
  this.grid = W.style('table', 'position:absolute;top:0px;left;');
  this.grid.cellPadding = this.grid.cellSpacing = 0;
  this.grid.style.background = 'url('+ W.path + this.image +')';
    
  // hide/show
  this.hide = function(isHide){
    if (isHide) {
      self.grid.style.display = 'none';
    }else self.grid.style.display = 'block';
  };
};


/**
 * add creature into the world
 *
 * @param {Creature} creature a creature to be added
 * @param {Integer} row the row to be inserted on
 * @param {Integer} col the col to be inserted on
 * @return {Creature} this creature with updated properties (mostly dimension info)
 * @test <a href='../../test/World_get_into_Oracle.html'>add a World into an Oracle</a>
 */
W.Place.prototype.add = function(creature, row, col){
  if(row > this.rows - 1) row = 0;
  if(col > this.cols - 1) col = 0;  
  // cross-referencing
  creature.place = this;
  creature.world = this.world;
  creature.row = row?row:creature.row;
  creature.col = col?col:creature.col;
  // adjust the creature dimension
  if(creature.resize)
    creature.resize(this.world.unit);
  // adjust the creature position
  creature.body.style.top = (creature.row * this.world.unit) + creature.top +'px';
  creature.body.style.left = (creature.col * this.world.unit) + creature.left +'px';
  // notify the creature the workspace limit
  creature.maxTop = this.height - creature.height + creature.top;
  creature.maxLeft = this.width - creature.width + creature.left;
  // assign the creature id
  creature.id = this.creatures.length;
  this.creatures[this.creatures.length] = creature;
  // register creature
  this.world.core.appendChild(creature.body);
  this.matrix[creature.row][creature.col].id = creature.id;
  this.matrix[creature.row][creature.col].cell.style.background = 'navy';
  // attach event handler(s)
  creature.algo('on_world_entry');
  return creature;
};


/**
 * show grid
 *
 * @param {Boolean} isOn true to turn on the grid display on .core<br>otherwise, false
 * @test <a href='../../test/World_showGrid.html'>reveal grid on/off</a>
 */
W.Place.prototype.showGrid = function(isOn){var self = this;  
  if(isOn){
    setBorder('solid 1px silver');
  }else setBorder('0px');
  
  function setBorder(border){
    for(var i = 0; i < self.rows; ++i){
      for (var j = 0; j < self.cols; ++j) {
        self.matrix[i][j].cell.style.border = border;
      }
    }
  };
};


/**
 * erase creature from the matrix
 *
 * @param {Number} id the id of a creature to be erased from the world
 */
W.Place.prototype.erase = function(id){
  var creature = this.creatures[id];
  this.matrix[creature.row][creature.col].id = -1;
  this.creatures[id] = -1;
};


/**
 * set the wall
 *
 * @param {String} bitmask string with wall data
 * @test <a href='../../test/World_with_wall.html'>World with wall</a>
 */
W.Place.prototype.set = function(bitmask){
  // define wall id
  //if(typeof this.wall == 'undefined')
  //  this.wall = {id: -2};
  var data = bitmask.split(':');
  data[1] = data[1].split(',');
  for(var i = 0; i < data[1].length; ++i)
    this.matrix[data[0]][data[1][i]].id = this.wall.id;
};


/**
 * Oracle's requirement: .tick() method taking the generated periodic events
 * @test <a href='../../test/World_with_Oracle.html'>World with Oracle</a>
 */
W.Place.prototype.tick = function(){
  // @TODO: self.ready = false;
  for(var i = 0; i < this.creatures.length; ++i){
    //if(this.creatures[i] != -1)
    this.creatures[i].action();
  }
};


/**
 * return creature on the given coordinate
 *
 * @param {Number} row given row
 * @param {Number} col given col
 * @return {Creature} creature if there is a creature on the given coordinate;
 * otherwise, return W.World.wall (creature ID: -2).
 */
W.Place.prototype.at = function(row, col){
  /*
    if(row < this.rows && coll < this.cols)
      return this.matrix[row][col];
    return false;
  */
  if(row > this.rows || row < 0) return this.wall;
  if(col > this.cols || col < 0) return this.wall;
  //window.status = 'world.rows:'+ world.rows +', world.cols:'+ world.cols +',row:'+ row +', col:'+ col;
  var id = this.matrix[row][col].id;
  if(id == -1) return false;  // empty (default)
  if(id == -2) return this.wall;  // wall
  // get creature
  var creature;
  for(var i = 0; i < this.creatures.length; ++i){
    creature = this.creatures[i];
    if(creature.row == row && creature.col == col)
    return creature;
  }
  return false;
};