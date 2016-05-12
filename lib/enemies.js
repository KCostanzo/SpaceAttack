var Util = require("./util");
var MovingObject = require("./movingObject");
var Ship = require("./ship");
var nmeBullet = require("./nmeBullet");

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
  ctx.drawImage(enemyShip, this.pos[0], this.pos[1], 35,35)
};

module.exports = Enemies;