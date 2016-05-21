var Game = require("./game");

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
  this.game.songPlay();
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