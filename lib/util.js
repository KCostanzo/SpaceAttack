var Util = {
  inherits: function (childClass, baseClass) {
    function Surrogate () { this.constructor = childClass };
    Surrogate.prototype = baseClass.prototype;
    childClass.prototype = new Surrogate();
  },

  dir: function (pos) {
    var norm = Util.norm(pos);
    return Util.scale(pos, 1 / norm);
  },

  dist: function (pos1, pos2) {
    return Math.sqrt(
      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
    );
  },

  norm: function (pos) {
    return Util.dist([0, 0], pos);
  },

  randomVec : function (length) {
    var deg = 2 * Math.PI * Math.random();
    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
  },

  scale: function (pos, m) {
    return [pos[0] * m, pos[1] * m];
  },
};

module.exports = Util;