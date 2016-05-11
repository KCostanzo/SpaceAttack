/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);
	var GameView = __webpack_require__(7);
	
	document.addEventListener("DOMContentLoaded", function(){
	  var canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	  var ctx = canvasEl.getContext("2d");
	  var game = new Game();
	  new GameView(game, ctx).start();
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Enemy = __webpack_require__(2);
	var Bullet = __webpack_require__(6);
	var Ship = __webpack_require__(5);
	
	var Game = function () {
	  this.enemies = [];
	  this.bullets = [];
	  this.ships = [];
	
	  this.addEnemies();
	};
	
	Game.BG_COLOR = "white";
	Game.DIM_X = 1000;
	Game.DIM_Y = 600;
	Game.FPS = 32;
	Game.NUM_ENEMIES = 20;
	
	Game.prototype.add = function (object) {
	  if (object.type === "Enemies") {
	    this.enemies.push(object);
	  } else if (object.type === "Bullet") {
	    this.bullets.push(object);
	  } else if (object.type === "Ship") {
	    this.ships.push(object);
	  } else {
	    throw "invalid";
	  }
	};
	
	Game.prototype.addEnemies = function () {
	  for (var i = 0; i < Game.NUM_ENEMIES; i++) {
	    this.add(new Enemy({ game: this }));
	  }
	};
	
	Game.prototype.addShip = function () {
	  var ship = new Ship({
	    pos: this.randomPosition(),
	    game: this
	  });
	
	  this.add(ship);
	
	  return ship;
	};
	
	Game.prototype.allObjects = function () {
	  return [].concat(this.ships, this.enemies, this.bullets);
	};
	
	Game.prototype.checkCollisions = function () {
	  var game = this;
	
	  this.allObjects().forEach(function (obj1) {
	    game.allObjects().forEach(function (obj2) {
	      if (obj1 == obj2) {
	        // don't allow self-collision
	        return;
	      }
	
	      if (obj1.isCollidedWith(obj2)) {
	        obj1.collideWith(obj2);
	      }
	    });
	  });
	};
	
	Game.prototype.draw = function (ctx) {
	  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	  ctx.fillStyle = Game.BG_COLOR;
	  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
	
	  this.allObjects().forEach(function (object) {
	    object.draw(ctx);
	  });
	};
	
	Game.prototype.isOutOfBounds = function (pos) {
	  return (pos[0] < 0) || (pos[1] < 0) ||
	    (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
	};
	
	Game.prototype.moveObjects = function (delta) {
	  this.allObjects().forEach(function (object) {
	    object.move(delta);
	  });
	};
	
	Game.prototype.randomPosition = function () {
	  return [
	    Game.DIM_X * Math.random(),
	    Game.DIM_Y * Math.random()
	  ];
	};
	
	Game.prototype.remove = function (object) {
	  if (object.type === "Bullet") {
	    this.bullets.splice(this.bullets.indexOf(object), 1);
	  } else if (object.type === "Enemies") {
	    var idx = this.enemies.indexOf(object);
	    this.enemies[idx] = new Enemy({ game: this });
	  } else if (object.type === "Ship") {
	    this.ships.splice(this.ships.indexOf(object), 1);
	  } else {
	    throw "invalid";
	  }
	};
	
	Game.prototype.step = function (change) {
	  this.moveObjects(change);
	  this.checkCollisions();
	};
	
	Game.prototype.wrap = function (pos) {
	  return [
	    wrap(pos[0], Game.DIM_X), wrap(pos[1], Game.DIM_Y)
	  ];
	
	  function wrap(coord, max) {
	    if (coord < 0) {
	      return max - (coord % max);
	    } else if (coord > max) {
	      return coord % max;
	    } else {
	      return coord;
	    }
	  }
	};
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var MovingObject = __webpack_require__(4);
	var Ship = __webpack_require__(5);
	
	var DEFAULTS = {
		COLOR: "#808080",
		RADIUS: 15,
		SPEED: 4
	};
	
	var Enemies = function (options = {}) {
	  options.color = DEFAULTS.COLOR;
	  options.pos = options.pos || options.game.randomPosition();
	  options.radius = DEFAULTS.RADIUS;
	  options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);
	
	  MovingObject.call(this, options);
	};
	
	
	Enemies.prototype.collideWith = function (otherObject) {
	  if (otherObject.type === "Ship") {
	    otherObject.relocate();
	    //Destroy
	  }
	};
	
	Util.inherits(Enemies, MovingObject);
	
	Enemies.prototype.type = "Enemies";
	
	module.exports = Enemies;

/***/ },
/* 3 */
/***/ function(module, exports) {

	var Util = {
	  inherits: function (childClass, baseClass) {
	    function Surrogate () { this.constructor = childClass };
	    Surrogate.prototype = baseClass.prototype;
	    childClass.prototype = new Surrogate();
	  },
	
	  dir: function (vec) {
	    var norm = Util.norm(vec);
	    return Util.scale(vec, 1 / norm);
	  },
	
	  dist: function (pos1, pos2) {
	    return Math.sqrt(
	      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  },
	
	  norm: function (vec) {
	    return Util.dist([0, 0], vec);
	  },
	
	  randomVec : function (length) {
	    var deg = 2 * Math.PI * Math.random();
	    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
	  },
	
	  scale: function (vec, m) {
	    return [vec[0] * m, vec[1] * m];
	  },
	};
	
	module.exports = Util;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	
	var MovingObject = function (options) {
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.radius = options.radius;
	  this.color = options.color;
	  this.game = options.game;
	};
	
	MovingObject.prototype.collideWith = function (otherObject) {
	  ; // default do nothing
	};
	
	MovingObject.prototype.draw = function (ctx) {
	  ctx.fillStyle = this.color;
	
	  ctx.beginPath();
	  ctx.arc(
	    this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
	  );
	  ctx.fill();
	};
	
	MovingObject.prototype.isCollidedWith = function (otherObject) {
	  var centerDist = Util.dist(this.pos, otherObject.pos);
	  return centerDist < (this.radius + otherObject.radius);
	};
	
	MovingObject.prototype.isWrappable = true;
	
	var TIME_FRAME = 1000/60;
	MovingObject.prototype.move = function (time) {
	  //time is number of milliseconds since last move
	  //if the computer is busy the time delta will be larger
	  //in this case the MovingObject should move farther in this frame
	  //velocity of object is how far it should move in 1/60th of a second
	  var velocityScale = time / TIME_FRAME,
	      offsetX = this.vel[0] * velocityScale,
	      offsetY = this.vel[1] * velocityScale;
	
	  this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
	
	  if (this.game.isOutOfBounds(this.pos)) {
	    if (this.isWrappable) {
	      this.pos = this.game.wrap(this.pos);
	    } else {
	      this.remove();
	    }
	  }
	};
	
	MovingObject.prototype.remove = function () {
	  this.game.remove(this);
	};
	
	module.exports = MovingObject;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Ship = __webpack_require__(5);
	var MovingObject = __webpack_require__(4);
	var Util = __webpack_require__(3);
	var Bullet = __webpack_require__(6);
	
	function randomColor() {
	  var hex = "0123456789ABCDEF";
	
	  var color = "#";
	  for (var i = 0; i < 3; i ++) {
	    color += hex[Math.floor((Math.random() * 16))];
	  }
	
	  return color;
	}
	
	var Ship = function (options) {
	  options.radius = Ship.RADIUS;
	  options.vel = [0, 0];
	  options.color = options.color || randomColor();
	
	  MovingObject.call(this, options);
	};
	
	Ship.prototype.type = "Ship";
	
	Ship.RADIUS = 15;
	
	Util.inherits(Ship, MovingObject);
	
	Ship.prototype.fireBullet = function () {
	
	  var relVel = Util.scale(
	    Util.dir(this.vel),
	    Bullet.SPEED
	  );
	
	  var bulletVel = [
	    relVel[0] + this.vel[0], relVel[1] + this.vel[1]
	  ];
	
	  var bullet = new Bullet({
	    pos: this.pos,
	    vel: bulletVel,
	    color: this.color,
	    game: this.game
	  });
	
	  this.game.add(bullet);
	};
	
	Ship.prototype.keyMove = function(dir) {
	  this.vel = [0,0];
	  if (dir === 'stop') {
	    this.vel = [0,0]
	  } else if (dir === 'left') {
	    this.vel = [-5,0];
	  } else if (dir === 'right') {
	    this.vel = [5,0];
	  } else if (dir === 'up') {
	    this.vel = [0,-5];
	  } else if (dir === 'down') {
	    this.vel = [0,5];
	  }
	
	  this.pos = [this.pos[0] + this.vel[0], this.pos[1] + this.vel[1]]
	};
	
	// Ship.prototype.power = function (impulse) {
	//   this.vel[0] += impulse[0];
	//   this.vel[1] += impulse[1];
	// };
	
	Ship.prototype.relocate = function () {
	  this.pos = this.game.randomPosition();
	  this.vel = [0, 0];
	};
	
	Ship.prototype.type = "Ship";
	
	module.exports = Ship;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var MovingObject = __webpack_require__(4);
	var Enemy = __webpack_require__(2);
	
	var Bullet = function (options) {
	  options.radius = Bullet.RADIUS;
	
	  MovingObject.call(this, options);
	};
	
	Bullet.RADIUS = 2;
	Bullet.SPEED = 15;
	
	Util.inherits(Bullet, MovingObject);
	
	Bullet.prototype.collideWith = function (otherObject) {
	  if (otherObject.type === "Enemies") {
	    this.remove();
	    otherObject.remove();
	  }
	};
	
	Bullet.prototype.isWrappable = false;
	Bullet.prototype.type = "Bullet";
	
	module.exports = Bullet;


/***/ },
/* 7 */
/***/ function(module, exports) {

	var GameView = function (game, ctx) {
	  this.ctx = ctx;
	  this.game = game;
	  this.ship = this.game.addShip();
	  this.keys = {
	    'w': 87,
	    'a': 65,
	    's': 83,
	    'd': 68
	  }
	};
	
	// GameView.MOVES = {
	//   "w": [ 0, -1],
	//   "a": [-1,  0],
	//   "s": [ 0,  1],
	//   "d": [ 1,  0],
	//   // 'w+a': [-20,-20],
	//   // 'a+w': [-20,-20],
	//   // 'w+d': [20,-20],
	//   // 'd+w': [20,-20],
	//   // 's+d': [20,20],
	//   // 'd+s': [20,20],
	//   // 'a+s': [-20,20],
	//   // 's+a': [-20,20]
	// };
	
	GameView.prototype.bindKeyHandlers = function () {
	  var ship = this.ship;
	
	  key("space", function () { ship.fireBullet() });
	};
	
	var keyDownHandler = function(event) {
	  if (event.keyCode === this.keys['w']) {
	    this.ship.keyMove('up');
	  } else if (event.keyCode === this.keys['a']) {
	    this.ship.keyMove('left'); 
	  } else if (event.keyCode === this.keys['s']) {
	    this.ship.keyMove('down'); 
	  } else if (event.keyCode === this.keys['d']) {
	    this.ship.keyMove('right');
	  }
	};
	
	var keyUpHandler = function(event) {
	    if (event.keyCode === this.keys['w']) {
	    this.ship.keyMove('stop');
	    // debugger;
	  } else if (event.keyCode === this.keys['a']) {
	    this.ship.keyMove('stop'); 
	  } else if (event.keyCode === this.keys['s']) {
	    this.ship.keyMove('stop'); 
	  } else if (event.keyCode === this.keys['d']) {
	    this.ship.keyMove('stop');
	  }
	};
	
	GameView.prototype.start = function () {
	  this.bindKeyHandlers();
	  this.lastTime = 0;
	  document.addEventListener("keydown", keyDownHandler.bind(this));
	  document.addEventListener("keyup", keyUpHandler.bind(this));
	
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	GameView.prototype.animate = function(time){
	  var timeChange = time - this.lastTime;
	
	  this.game.step(timeChange);
	  this.game.draw(this.ctx);
	  this.lastTime = time;
	
	  //every call to animate requests causes another call to animate
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	module.exports = GameView;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map