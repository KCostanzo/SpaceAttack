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
	var GameView = __webpack_require__(2);
	
	document.addEventListener("DOMContentLoaded", function(){
	  var canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	  var ctx = canvasEl.getContext("2d");
	  var game = new Game();
	  new GameView(game, ctx).start();
		document.addEventListener('keydown', function(e) {
			if (e.keyCode === 13) {
				// var newGame = new Game();
				// // newGame.enemies[0].pos = [60,0];
				// new GameView(new Game(), ctx).start();
				location.reload();
			}
		});
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Enemy = __webpack_require__(3);
	var Bullet = __webpack_require__(7);
	var Ship = __webpack_require__(6);
	
	var Game = function () {
	  this.enemies = [];
	  this.bullets = [];
	  this.ships = [];
	  this.winStatus = '';
	  this.over = false;
	  this.score = 0;
	
	  this.addEnemies();
	};
	
	Game.BG_COLOR = "black";
	Game.DIM_X = 1200;
	Game.DIM_Y = 620;
	Game.FPS = 32;
	Game.NUM_ENEMIES = 40;
	
	Game.prototype.add = function (object) {
	  if (object.type === "Enemies") {
	    this.enemies.push(object);
	  } else if (object.type === "Bullet") {
	    this.bullets.push(object);
	  } else if (object.type === "nmeBullet") {
	    this.bullets.push(object);
	  } else if (object.type === "Ship") {
	    this.ships.push(object);
	  } 
	  // else {
	  //   throw "invalid";
	  // }
	};
	
	Game.prototype.addEnemies = function () {
	  var posX = 0, posY = 0;
	  for (var i = 0; i < Game.NUM_ENEMIES; i++) {
	    if (i % 10 === 0) {
	      posX = -60;
	      posY += 50
	    };
	    posX += 60
	    var nme = new Enemy({game: this, pos: [posX,posY] });
	    // debugger;
	    this.add(nme);
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
	
	//unused atm
	Game.prototype.checkCollisions = function () {
	  var game = this;
	
	  this.allObjects().forEach(function (obj1) {
	    game.allObjects().forEach(function (obj2) {
	        // don't allow self-collision
	      if (obj1 == obj2) {
	        return;
	      }
	
	      if (obj1.isCollidedWith(obj2)) {
	        obj1.collideWith(obj2);
	      }
	    });
	  });
	};
	
	Game.prototype.reverseEnemies = function() {
	  // debugger;
	  this.enemies.forEach(function(nme) {
	    nme.vel = [-(nme.vel[0]),nme.vel[1]];
	    nme.pos = [nme.pos[0], nme.pos[1] + 20]
	  });
	};
	
	Game.prototype.endGame = function(ctx) {
	  // ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	  ctx.fillRect(350, 100, 500, 350);
	  ctx.fillStyle = 'black';
	  ctx.font = '24px courier';
	  ctx.fillText('Game Over', 420, 150);
	  if (this.winStatus === 'win') {
	    ctx.fillText('You Win!!!', 420, 220);
	  } else {
	    ctx.fillText('You Lose...',420,220);
	  }
	  ctx.fillText('Hit Enter to play again!', 420, 350)
	  //DIM_Y / 2 - 50
	}; 
	
	var bg = new Image();
	bg.src = "http://res.cloudinary.com/mr-costanzo/image/upload/v1463023016/xX2GRj6_pcca8x.gif";
	
	Game.prototype.draw = function (ctx) {
	  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	  ctx.fillStyle = Game.BG_COLOR;
	  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
	  ctx.drawImage(bg, 0,0 ,Game.DIM_X, Game.DIM_Y);
	  ctx.fillStyle = 'white';
	  ctx.font = '24px courier';
	  ctx.fillText('Score: ' + this.score, 950, 50)
	  ctx.fillStyle = '16px arial';
	  ctx.fillText('Left, Right Arrows or A, D to move, Spacebar to fire', 50,20)
	
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
	    // this.enemies[idx] = new Enemy({ game: this });
	    this.enemies.splice(idx,1);
	    this.score += 1
	    // if (this.enemies.length() === 0) {
	    //   this.gameOver('win');
	    // }
	  } else if (object.type === "Ship") {
	    this.ships.splice(this.ships.indexOf(object), 1);
	    this.gameOver('lose');
	  } else if (object.type === "nmeBullet") {
	    this.bullets.splice(this.bullets.indexOf(object), 1);
	  }
	  // else {
	  //   throw "invalid";
	  // }
	};
	
	Game.prototype.gameOver = function(endType) {
	  this.winStatus = endType;
	  this.over = true;
	};
	
	Game.prototype.step = function (change) {
	  this.moveObjects(change);
	  this.checkCollisions();
	  this.enemies.forEach(function(nme) {
	    var rand = Math.random();
	    if (rand < 0.004) {
	      nme.enemyFire();
	    }
	  });
	    if (this.enemies.length === 0) {
	      this.gameOver('win');
	    };
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

	var Game = __webpack_require__(1);
	
	var GameView = function (game, ctx) {
	  this.ctx = ctx;
	  this.game = game;
	  this.ship = this.game.addShip();
	  this.keys = {
	    'w': 87,
	    'a': 65,
	    's': 83,
	    'd': 68,
	    'enter': 13,
	    'larrow': 37,
	    'rarrow': 39,
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
	
	// var enterHandler = function(event) {
	//   if (event.keyCode === this.keys['enter']) {
	//     this.game = new Game();
	//     this.ctx = this.ctx;
	//     this.ship = this.game.addShip();
	//     this.start();
	//   }
	// };
	
	var keyDownHandler = function(event) {
	  if (event.keyCode === this.keys['a']) {
	    this.ship.keyMove('left'); 
	  } else if (event.keyCode === this.keys['d']) {
	    this.ship.keyMove('right');
	  } else if (event.keyCode === this.keys['larrow']) {
	    this.ship.keyMove('left'); 
	  } else if (event.keyCode === this.keys['rarrow']) {
	    this.ship.keyMove('right');
	  }
	
	  //(event.keyCode === this.keys['w']) {
	   // this.ship.keyMove('up');
	    //  } else if (event.keyCode === this.keys['s']) {
	    // this.ship.keyMove('down'); 
	
	  // else if (event.keyCode === this.keys['enter']) {
	  //   this.start()
	  // }
	};
	
	var keyUpHandler = function(event) {
	    // debugger;
	  if (event.keyCode === this.keys['a']) {
	    this.ship.keyMove('stop'); 
	  } else if (event.keyCode === this.keys['d']) {
	    this.ship.keyMove('stop');
	  } else if (event.keyCode === this.keys['larrow']) {
	    this.ship.keyMove('stop'); 
	  } else if (event.keyCode === this.keys['rarrow']) {
	    this.ship.keyMove('stop');
	  }
	};
	
	//    if (event.keyCode === this.keys['w']) {
	    //this.ship.keyMove('stop');
	  // } else if (event.keyCode === this.keys['s']) {
	  //   this.ship.keyMove('stop'); 
	
	// var enemiesFire = function() {
	//   // debugger;
	//   this.enemies.forEach(function(nme) {
	//     nme.enemyFire();
	//   })
	// };
	// GameView.prototype.reverseTime = function() {
	//   debugger;
	//   setInterval(this.game.reverseEnemies(), 5000);
	//   // this.game.reverseEnemies();
	// };
	
	
	GameView.prototype.start = function () {
	  // debugger;
	  this.bindKeyHandlers();
	  this.lastTime = 0;
	  document.addEventListener("keydown", keyDownHandler.bind(this));
	  document.addEventListener("keyup", keyUpHandler.bind(this));
	  // document.removeEventListener('keydown', enterHandler);
	
	  setInterval(this.game.reverseEnemies.bind(this.game),4800);
	  requestAnimationFrame(this.animate.bind(this));
	
	  // this.reverseTime();
	};
	
	GameView.prototype.animate = function(time){
	  var timeChange = time - this.lastTime;
	
	  if (this.game.over) {
	    this.game.endGame(this.ctx);
	    // document.addEventListener('keydown', enterHandler.bind(this));
	    // this.game.over = false;
	  } else {
	    this.game.step(timeChange);
	    this.game.draw(this.ctx);
	    this.lastTime = time;
	
	    //re-call animate
	    requestAnimationFrame(this.animate.bind(this));
	  }
	
	};
	
	module.exports = GameView;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4);
	var MovingObject = __webpack_require__(5);
	var Ship = __webpack_require__(6);
	var nmeBullet = __webpack_require__(8);
	
	var DEFAULTS = {
		COLOR: 'red',
	  //"#808080"
		RADIUS: 15,
		SPEED: 4
	};
	
	var Enemies = function (options = {}) {
	  options.color = DEFAULTS.COLOR;
	  options.pos = options.pos || options.game.randomPosition();
	  options.radius = DEFAULTS.RADIUS;
	  options.vel = [2,0] || Util.randomVec(DEFAULTS.SPEED);
	
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
	
	Enemies.prototype.enemyFire = function () {
	  // var relVel = Util.scale(
	  //   Util.dir(this.vel),
	  //   nmeBullet.SPEED
	  // );
	
	  // var bulletVel = [
	  //   relVel[0] + this.vel[0], relVel[1] + this.vel[1]
	  // ];
	
	  var bullet = new nmeBullet({
	    pos: this.pos,
	    vel: [0,5],
	    //bulletVel
	    color: this.color,
	    game: this.game
	  });
	
	  this.game.add(bullet)
	};
	
	var enemyShip = new Image();
	enemyShip.src = "http://res.cloudinary.com/mr-costanzo/image/upload/v1463008676/logo200-17525_ekltmm.png";
	
	Enemies.prototype.draw = function(ctx) {
	  // var XSize = this.size[0];
	  // var YSize = this.size[1];
	  ctx.drawImage(enemyShip, this.pos[0] - 20, this.pos[1] - 20, 35,35)
	};
	
	module.exports = Enemies;

/***/ },
/* 4 */
/***/ function(module, exports) {

	var Util = {
	  inherits: function (childClass, baseClass) {
	    function Surrogate () { this.constructor = childClass };
	    Surrogate.prototype = baseClass.prototype;
	    childClass.prototype = new Surrogate();
	  },
	
	  dir: function (pos) {
	    var norm = Util.norm(pos);
	    return Util.scale(pos, 1 / norm);
	  },
	
	  dist: function (pos1, pos2) {
	    return Math.sqrt(
	      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  },
	
	  norm: function (pos) {
	    return Util.dist([0, 0], pos);
	  },
	
	  randomVec : function (length) {
	    var deg = 2 * Math.PI * Math.random();
	    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
	  },
	
	  scale: function (pos, m) {
	    return [pos[0] * m, pos[1] * m];
	  },
	};
	
	module.exports = Util;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4);
	
	var MovingObject = function (options) {
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.radius = options.radius;
	  this.color = options.color;
	  this.game = options.game;
	};
	
	MovingObject.prototype.collideWith = function (otherObject) {
	  // default do nothing
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Ship = __webpack_require__(6);
	var MovingObject = __webpack_require__(5);
	var Util = __webpack_require__(4);
	var Bullet = __webpack_require__(7);
	
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
	  options.pos = [75,590]
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
	    //bulletVel
	    vel: [0,-20],
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
	  }
	  // } else if (dir === 'up') {
	  //   this.vel = [0,-5];
	  // } else if (dir === 'down') {
	  //   this.vel = [0,5];
	  // }
	
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
	
	var myShip = new Image();
	myShip.src = "http://res.cloudinary.com/mr-costanzo/image/upload/v1463024632/spaceship3_n2ajql.png";
	
	Ship.prototype.draw = function(ctx) {
	  // var XSize = this.size[0];
	  // var YSize = this.size[1];
	  ctx.drawImage(myShip, this.pos[0] - 30, this.pos[1] - 30, 60,60)
	};
	
	module.exports = Ship;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4);
	var MovingObject = __webpack_require__(5);
	var Enemy = __webpack_require__(3);
	
	var Bullet = function (options) {
	  options.radius = Bullet.RADIUS;
	  options.color = 'yellow';
	
	  MovingObject.call(this, options);
	};
	
	Bullet.RADIUS = 3;
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4);
	var MovingObject = __webpack_require__(5);
	var Enemy = __webpack_require__(3);
	
	var nmeBullet = function (options) {
	  options.radius = nmeBullet.RADIUS;
	  // options.color = 'red';
	
	  MovingObject.call(this, options);
	};
	
	nmeBullet.RADIUS = 5;
	nmeBullet.SPEED = 8;
	
	Util.inherits(nmeBullet, MovingObject);
	
	nmeBullet.prototype.collideWith = function (otherObject) {
	  if (otherObject.type === "Ship") {
	    this.remove();
	    otherObject.remove();
	  }
	};
	
	nmeBullet.prototype.isWrappable = false;
	nmeBullet.prototype.type = "nmeBullet";
	
	module.exports = nmeBullet;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map