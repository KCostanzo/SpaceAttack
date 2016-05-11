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