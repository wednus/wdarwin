/**
 * \file World.js   Wednus World class
 *
 * This class implements a prototype of HTMLElement object containers. (world)
 * - .unit: defines the size (pixel) of squire unit space of the world
 * - .cols/.rows: number of unit-sized cells
 * @param {Object} args extend/override constructor w/ this passed args object
 * @test <a href='../../test/World.html'>default construction</a>
 * @test <a href='../../test/World_4by4.html'>creature a 4*4 world</a>
 * 
 * @author Sundew H. Shin
 * @version 0.3.0
 */

W.World = function(args){var self = this;
  // .core: position
  this.top = 0;
  this.left = 0;
  this.width = 0;
  this.height = 0;
  this.unit = 24;
  // begin dir/position
  this.bdir = 'south';
  this.brow = 0;
  this.bcol = 0;
  // status properties
  //this.ready = true;  // ready status
  this.stop = false;  // stop world
  this.msg_delay = 0;
  this.preset_msg_delay = 100;
  // containers
  //this.creatures = [];
  //this.matrix = [];  // creatures matrix
  this.messages = []; // messages queue
  this.places = [];  // places queue
  // extend/override constructor w/ passed args object
  for(var i in args)
    eval('this.'+ i +' = args["'+ i +'"];');
  // place scroll reference
  this.halfWidth = parseInt(this.width / 2);
  this.halfHeight = parseInt(this.height /2);
  
  // WPS components: build .body & .core
  this.body = W.style('div', 'top:0px;left:0px;width:'+ this.width +'px;height:'
    + this.height +'px;zIndex:1;overflow:hidden;position:absolute;');
  this.core = W.style('div', 'background:navy;width:100%;height;overflow:hidden;');
  this.body.appendChild(this.core);
  /*
  this.body = W.style('div', 'top:0px;left:0px;width:'+ (this.width + this.left)
    +'px;height:'+ (this.height + this.top) +'px;zIndex:1;overflow:hidden;'
    +'position:absolute');
  */
  /*
  this.core = W.style('div', 'top:'+ this.top +'px;left:'+ this.left +'px;width:'
    + this.width +'px;height:'+ this.height +'px;zIndex:1;overflow:hidden;'
    +'position:absolute');
  */
};


/**
 * add a place
 * @param {Object} place
 */
W.World.prototype.add = function(place){var self = this;
  this.places[this.places.length] = place;
  this.core.appendChild(place.grid);
  // cross-referencing
  place.world = this;
    
  // detect image size by pre-loading
  var back = new Image();
  back.src = W.path + place.image;
  // for Safari or other browsers not ensure finishing image loading as src declaration
  // http://dhtmlforsafari.blogspot.com/2007/06/failure-classic-method-of-image-size.html
  if (back.width == 0) {
    back.onload = function(){defineSize(this.width, this.height);};
  }else defineSize(back.width, back.height);

  buildMatrix(place.rows, place.cols);

  // local helper functions
  function defineSize(width, height){
    place.width = width;
    place.height = height;
    // calculate the scrollable range
    if(self.width < place.width){
      place.horiScrollStart = Math.floor(self.width / 2);
      place.horiScrollEnd = Math.ceil(place.width - (self.width / 2));
    }else place.horiScrollStart = place.horiScrollEnd = place.width;      
    if(self.height < place.height){
      place.vertScrollStart = Math.floor(self.height / 2);
      place.vertScrollEnd = Math.ceil(place.height - (self.height / 2));
    }else place.vertScrollStart = place.vertScrollEnd = place.height;
    //window.status = 'place.horiScrollStart:'+ place.horiScrollStart +',place.horiScrollEnd:'+ place.horiScrollEnd;
    //window.status = 'place.vertScrollStart:'+ place.vertScrollStart +',place.vertScrollEnd:'+ place.vertScrollEnd;
    place.cols = parseInt(width / self.unit);  // get the quotient
    place.rows = parseInt(height / self.unit);
    W.style(place.grid, 'width:'+ (place.cols * self.unit) + 'px;height:'
      + (place.rows * self.unit) +'px');
  };
  // build creature matrix
  function buildMatrix(rows, cols){var tr;
    for(var i = 0; i < rows; ++i){
      tr = W.style('tr', 'height:' + self.unit + 'px');
      place.grid.appendChild(tr);
      place.matrix[i] = [];
      for (var j = 0; j < cols; ++j) {
        place.matrix[i][j] = {
          id: -1,
          selected: false,
          cell: W.style('td', 'width:' + (self.unit - 1) + 'px')
        };
        tr.appendChild(place.matrix[i][j].cell);
        // define walls
        var selected = place.matrix[i][j].selected;
        var id = place.matrix[i][j].id;
        place.matrix[i][j].cell.onclick = function(){
          if (!selected) { // toggle background color
            selected = true;
            id = -2;
            this.style.background = 'red';
          }else {
            selected = false;
            id = -1;
            this.style.background = 'transparent';
          }
        };
      }
    }
  };
};


/**
 * output to an message board
 */
W.World.prototype.writeMessage = function(msg){
	window.status = msg;
};


/**
 * Oracle's requirement: .tick() method taking the generated periodic events
 * @test <a href='../../test/World_with_Oracle.html'>World with Oracle</a>
 */
W.World.prototype.tick = function(){
  // @TODO: self.ready = false;
  for(var i = 0; i < this.places.length; ++i){
		this.places[i].tick();
	}
	// ensures message lasts during pre-defined duration
	if(this.msg_delay != 0){
		--this.msg_delay;
		return;
	}
	// bring up the next message if there's any.
	if(this.messages.length != 0){
		this.writeMessage(this.messages[0]);
		this.msg_delay = this.preset_msg_delay;
		this.messages.shift();
	};
};


/**
 * hide/unhide the world's presentation layer
 *
 * @param {Boolean} isHide true for hide the world
 */
W.World.prototype.hide = function(isHide){
	if(isHide){
		this.body.style.display = 'none';
	}else this.body.style.display = 'block';		
};