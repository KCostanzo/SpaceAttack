var Util = require("./util");
var MovingObject = require("./movingObject");
var Enemy = require("./enemies");

var nmeBullet = function (options) {
  options.radius = nmeBullet.RADIUS;

  MovingObject.call(this, options);
};

nmeBullet.RADIUS = 2;
nmeBullet.SPEED = 15;

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
