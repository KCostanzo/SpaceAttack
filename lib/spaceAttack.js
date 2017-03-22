var Game = require("./game");
var GameView = require("./gameView");

document.addEventListener("DOMContentLoaded", function(){
  var canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  var ctx = canvasEl.getContext("2d");
  var game = new Game();
  new GameView(game, ctx).start();
  
  document.addEventListener('keydown', function(e) {
	if (e.keyCode === 13) {
		location.reload();
	}
	});
});

		// var newGame = new Game();
		// // newGame.enemies[0].pos = [60,0];
		// new GameView(new Game(), ctx).start();