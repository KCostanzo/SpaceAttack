var Util = require("./util");
var MovingObject = require("./movingObject");
var Enemy = require("./enemies");

var Bullet = function (options) {
  options.radius = Bullet.RADIUS;
  options.color = 'yellow';

  MovingObject.call(this, options);
};

Bullet.RADIUS = 3;
Bullet.SPEED = 15;

Util.inherits(Bullet, MovingObject);

Bullet.prototype.collideWith = function (otherObject) {
  if (otherObject.type === "Enemies") {
    this.remove();
    otherObject.remove();
  }
};

Bullet.prototype.isWrappable = false;
Bullet.prototype.type = "Bullet";

module.exports = Bullet;
