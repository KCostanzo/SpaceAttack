var Enemy = require("./enemies");
var Bullet = require("./bullet");
var Ship = require("./ship");

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
  } 
  // else {
  //   throw "invalid";
  // }
};

Game.prototype.addEnemies = function () {
  for (var i = 0; i < Game.NUM_ENEMIES; i++) {
    var nme = new Enemy({game: this });
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
  } 
  // else {
  //   throw "invalid";
  // }
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
