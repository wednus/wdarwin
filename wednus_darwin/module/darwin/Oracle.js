/**
 * \file Oracle.js Wednus Oracle class
 *
 * This file contains the class definition of the W.Oracle. Oracle implements an
 * abstract time manager which distributes tick signal to its member objects
 * such as the instances of the W.World class; All world instances of an oracle
 * shares only one clock.
 * @author Sundew H. Shin
 * @version 0.2.0
 */

/**
 * Oracle class
 *
 * This class defines the class generates periodic events (tick) to the added
 * objects (world).
 * world object requires one method:
 * - .tick - method which will get the tick for the world
 *
 * and supports one presentation layer:
 * - .body (optional: div element) - presentation layer to be appended on to the W.body
 *
 * @param {Object} args extend/override constructor w/ this passed args object
 * @test <a href='../../test/Oracle.html'>An Oracle instance (default construction)</a>
 */
W.Oracle = function(args){var self = this;
  // not from the darwin module inclusion
  if(!W.darwin) W.darwin = {oracles:[]};
  this.id = W.darwin.oracles.length;
  this.worlds = [];
  this.isClockShown = false;

  // register autorun func.
  W.event(window, 'onload', init);
  // register this instance to the darwin's oracle pool
  W.darwin.oracles[this.id] = this;

  /**
   * init oracle
   */
  function init(){
    // append worlds' presentation layer
    for(var i = 0; i < self.worlds.length; ++i){
      var world = self.worlds[i];
      world.time = 0;
      world.ticks = 0;
      if(!world.delay)
        world.delay = 0;
      if(world.body)
        W.body.appendChild(world.body);
    }
    // tick the worlds registered in oracle
    self.run();
  };

  // extend/override constructor w/ passed args object
  for(var i in args)
    eval('this.'+ i +' = args["'+ i +'"];');
};


/**
 * register a world into the world pool of oracle
 *
 * @param {World} world a world to be added
 * @test <a href='../../test/Oracle_with_multiple_consumers.html'>one oracle and
 * multiple worlds (tick consumers)</a>
 */
W.Oracle.prototype.add = function(world){
  this.worlds[this.worlds.length] = world;
  world.oracle = this;
};

/**
 * distribute ticks to each world
 */
W.Oracle.prototype.run = function(){
  var world;
  for(var i = 0; i < this.worlds.length; ++i){
    world = this.worlds[i];
    if(!world.paused){
      if(world.ticks == world.delay){
        // run tick()
        if(world.tick)
          world.tick();
        // update clock
        if(this.isClockShown && world.clock)
          //world.clock.innerHTML = new Date(++world.time * 10);
          world.clock.innerHTML = ++world.time;
        // init. ticks
        world.ticks = 0;
      }else ++world.ticks;
    }
  }
  setTimeout('W.darwin.oracles['+ this.id +'].run()', 0);
};


/**
 * pause all worlds registered to this oracle
 * @todo maybe we can also temporarily disable 'setTimeout' itself for releasing
 * resource.
 * @test <a href='../../test/Oracle_pause_resume.html'>pause/resume oracle</a>
 */
W.Oracle.prototype.pause = function(){
  var world;
  for(var i = 0; i < this.worlds.length; ++i){
    world = this.worlds[i];
    world.paused = true;
  }
};


/**
 * resume paused worlds registered to this oracle
 * @test <a href='../../test/Oracle_pause_resume.html'>pause/resume oracle</a>
 */
W.Oracle.prototype.resume = function(){
  var world;
  for(var i = 0; i < this.worlds.length; ++i){
    world = this.worlds[i];
    world.paused = false;
  }
};


/**
 * show clock
 *
 * @param {Boolean} isOn true if the clock to be shown on each world<br>otherwise, false
 * @test <a href='../../test/Oracle_showClock.html'>reveal clock on/off</a>
 */
W.Oracle.prototype.showClock = function(isOn){var self = this;
  // handle the case executing this method before adding any world
  if(this.worlds.length == 0){
    W.event(window, 'onload', clock_on_off);
  }else clock_on_off();

  function clock_on_off(){
    for(var i = 0; i < self.worlds.length; ++i){
      var world = self.worlds[i];
      // no body, no clock
      if(world.body){
        if(isOn){
          if(!world.clock){
            world.clock = W.style('div', 'color:lime;fontSize:10px;display:none');
            world.body.appendChild(world.clock);
          }
          world.clock.style.display = 'block';
          self.isClockShown = true;
        }else{
          world.clock.style.display = 'none';
          self.isClockShown = false;
        }
      }
    }
  };
};