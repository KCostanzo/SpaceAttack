var Util = require("./util");
var MovingObject = require("./movingObject");
var Ship = require("./ship");
var nmeBullet = require("./nmeBullet");

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

Enemies.prototype.enemyFire = function () {

  var relVel = Util.scale(
    Util.dir(this.vel),
    nmeBullet.SPEED
  );

  var bulletVel = [
    relVel[0] + this.vel[0], relVel[1] + this.vel[1]
  ];

  var bullet = new nmeBullet({
    pos: this.pos,
    vel: bulletVel,
    color: this.color,
    game: this.game
  });

  setTimeout(this.game.add(bullet),10000);
};

module.exports = Enemies;