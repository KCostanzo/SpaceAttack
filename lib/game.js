var Enemy = require("./enemies");
var Bullet = require("./bullet");
var Ship = require("./ship");
var Explosion = require("./explosions");

var Game = function () {
  this.enemies = [];
  this.bullets = [];
  this.ships = [];
  this.explosions = [];
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

var bulletFire = new Audio('http://res.cloudinary.com/mr-costanzo/video/upload/v1463855273/shoot_r2isgr.wav');
bulletFire.volume = .05;

Game.prototype.add = function (object) {
  if (object.type === "Enemies") {
    this.enemies.push(object);
  } else if (object.type === "Bullet") {
    bulletFire.currentTime = 0;
    bulletFire.play();
    this.bullets.push(object);
  } else if (object.type === "nmeBullet") {
    this.bullets.push(object);
  } else if (object.type === "Ship") {
    this.ships.push(object);
  } else if (object.type === 'explosion') {
    this.explosions.push(object);
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

Game.prototype.addExplosion = function(pos) {
  var explosion = new Explosion({
    pos: pos,
    game: this
  });
  this.add(explosion);
  return explosion;
};

Game.prototype.allObjects = function () {
  return [].concat(this.ships, this.enemies, this.bullets, this.explosions);
};

//unused atm
Game.prototype.checkCollisions = function () {
  var game = this;

  this.allObjects().forEach(function (obj1) {
    game.allObjects().forEach(function (obj2) {
      if (obj1.type === 'explosion' || obj2.type === 'explosion') {
        return;
      }
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

// Game.prototype.checkReverse = function() {
//   var game = this;
//   debugger;
//   this.enemies.forEach(function(nme) {
//     if (nme.pos[0] >= Game.DIM_X - 25 || nme.pos[0] <= 25) {
//       game.reverseEnemies();
//       return;
//     }
//   });
// };

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

var explodeSound = new Audio('http://res.cloudinary.com/mr-costanzo/video/upload/v1463787026/atari_boom_ywwzdw.wav');
explodeSound.volume = .1;
var shipExplode = new Audio('http://res.cloudinary.com/mr-costanzo/video/upload/v1463787451/atari_boom5_dwwfkn.wav');
shipExplode.volume = .1;

Game.prototype.remove = function (object) {
  if (object.type === "Bullet") {
    this.bullets.splice(this.bullets.indexOf(object), 1);
  } else if (object.type === "Enemies") {
    var idx = this.enemies.indexOf(object);
    // this.enemies[idx] = new Enemy({ game: this });
    this.enemies.splice(idx,1);
    this.score += 1;
    this.addExplosion(object.pos);
    explodeSound.currentTime = 0;
    explodeSound.play();
    // if (this.enemies.length() === 0) {
    //   this.gameOver('win');
    // }
  } else if (object.type === "Ship") {
    this.ships.splice(this.ships.indexOf(object), 1);
    this.addExplosion(object.pos);
    shipExplode.play();
    this.gameOver('lose');
  } else if (object.type === "nmeBullet") {
    this.bullets.splice(this.bullets.indexOf(object), 1);
  } else if (object.type === "explosion") {
    this.explosions.splice(this.explosions.indexOf(object),1);
  }
  // else {
  //   throw "invalid";
  // }
};

// var song = new Audio('http://res.cloudinary.com/mr-costanzo/video/upload/v1463856527/I-F_Space_Invaders_-_Are_smoking_Grass_www.MP3Fiber.com_uzxhjw.mp3');
// song.volume = .3;

// Game.prototype.songPlay = function() {
//   song.currentTime = 18;
//   song.play();
// };

Game.prototype.gameOver = function(endType) {
  this.winStatus = endType;
  this.over = true;
};

Game.prototype.step = function (change) {
  this.moveObjects(change);
  this.checkCollisions();
  // this.checkReverse();
  this.enemies.forEach(function(nme) {
    var rand = Math.random();
    if (rand < 0.004) {
      nme.enemyFire();
    }
  });
    if (this.enemies.length === 0) {
      this.gameOver('win');
    } else if (this.enemiesLanded()) {
      this.gameOver('lose');
    };
};

Game.prototype.enemiesLanded = function() {
  var landed = false;
  this.enemies.forEach(function(nme) {
    if (nme.pos[1] >= 580) {
      landed = true;
    }
  })
  return landed;
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
