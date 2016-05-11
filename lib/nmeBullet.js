var Util = require("./util");
var MovingObject = require("./movingObject");
var Enemy = require("./enemies");

var nmeBullet = function (options) {
  options.radius = nmeBullet.RADIUS;

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
