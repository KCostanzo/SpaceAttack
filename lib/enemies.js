var Util = require("./util");
var MovingObject = require("./movingObject");
var Ship = require("./ship");

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