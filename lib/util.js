var Util = {
  inherits: function (childClass, baseClass) {
    function Surrogate () { this.constructor = childClass };
    Surrogate.prototype = baseClass.prototype;
    childClass.prototype = new Surrogate();
  },

  dir: function (vec) {
    var norm = Util.norm(vec);
    return Util.scale(vec, 1 / norm);
  },

  dist: function (pos1, pos2) {
    return Math.sqrt(
      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
    );
  },

  norm: function (vec) {
    return Util.dist([0, 0], vec);
  },

  randomVec : function (length) {
    var deg = 2 * Math.PI * Math.random();
    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
  },

  scale: function (vec, m) {
    return [vec[0] * m, vec[1] * m];
  },
};

module.exports = Util;