var Ship = require("./ship");
var MovingObject = require("./movingObject");
var Util = require("./util");
var Bullet = require("./bullet");

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