var Explosion = function (options) {
  this.game = options.game;
  this.pos = options.pos;
  this.radius = 1;
  this.type = 'explosion';
  this.growing = true;
};

Explosion.prototype.draw = function(ctx) {
  var exp1 = new Image();
  exp1.src = 'http://res.cloudinary.com/mr-costanzo/image/upload/v1463770011/p1_p9xzpi.png';
  var exp2 = new Image();
  exp2.src = 'http://res.cloudinary.com/mr-costanzo/image/upload/v1463770011/p2_wjevtw.png';
  var exp3 = new Image();
  exp3.src = 'http://res.cloudinary.com/mr-costanzo/image/upload/v1463770011/p3_kycz5q.png';
  var exp4 = new Image();
  exp4.src = 'http://res.cloudinary.com/mr-costanzo/image/upload/v1463770011/p4_z9fu90.png';
  var exp5 = new Image();
  exp5.src = 'http://res.cloudinary.com/mr-costanzo/image/upload/v1463770011/p5_ew5cp1.png';
  if (this.radius < 2.1){
    ctx.drawImage(exp1, this.pos[0] - 15, this.pos[1] - 15, 20, 20);
  }
  if (this.radius < 4.1 && this.radius >= 2.1){
    ctx.drawImage(exp2, this.pos[0] - 15, this.pos[1] - 15, 20, 20);
  }
  if (this.radius < 6.1 && this.radius >= 4.1){
    ctx.drawImage(exp3, this.pos[0] - 15, this.pos[1] - 15, 30, 30);
  }
  if (this.radius < 8.1 && this.radius >= 6.1){
    ctx.drawImage(exp4, this.pos[0] - 15, this.pos[1] - 15, 40, 40);
  }
  if (this.radius < 10.1 && this.radius >= 8.1){
    ctx.drawImage(exp5, this.pos[0] - 15, this.pos[1] - 15, 40, 40);
  }
  // ctx.beginPath();
  // ctx.fillStyle = '#f35d4f';
  // ctx.arc(
  //   this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
  // );
  // ctx.fill();
};

var NORMAL_FRAME_TIME_DELTA = 1000/60;

Explosion.prototype.move = function(timeDelta) {
  var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA;
  if (this.growing) {
    this.radius = this.radius + velocityScale * 0.5;
  } else {
    this.radius = this.radius - velocityScale * 1;
  }

  if (this.radius > 10 && this.growing) {
    this.growing = false;
    this.game.remove(this);
};


module.exports = Explosion;