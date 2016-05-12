#Space Attack

[SpaceAttck Live!][live]

[live]: http://kcostanzo.github.io/SpaceAttack/

Space Attack is based on the classic arcade game Space Invaders built entirely in JavaScript front-end.

###Instructions

'A' and 'D' keys or Left an Right Arrows move your spaceship left or right.
'Spacebar' fires bullets.
Dodge the enemy bullets!

###Tech

All JavaScript, built using canvas display and position mapping.

###Implementation Details

One of the more difficult aspects of this game's construction was determining how to get the enemies to fire bullets at a reasonable rate, since all enemies could not reasonably fire in every render or they would all fire ~30 bullets every second. I used a random number checker in the game's step (render) function to regulate enemy fire: 

```javascript
  this.enemies.forEach(function(nme) {
    var rand = Math.random();
    if (rand < 0.004) {
      nme.enemyFire();
    }
  });
```
A potential weakness that will hinder future level construction is in my reverseEnemies() function, which currently runs based on a set Interval:

```javascript
	Game.prototype.reverseEnemies = function() {
	  // debugger;
	  this.enemies.forEach(function(nme) {
	    nme.vel = [-(nme.vel[0]),nme.vel[1]];
	    nme.pos = [nme.pos[0], nme.pos[1] + 20]
	  });
	};
```
called in the game view start method with:

```javascript
	setInterval(this.game.reverseEnemies.bind(this.game),4700);
```

Another way that would scale better with increasing enemy speed would be to use a location checker for the last ship on the row which would make the reversals independent of time, will attempt to implement in future versions.

###Todos

- [ ] Multiple Levels
- [ ] Enemy bullet aiming
- [ ] Bosses
- [ ] Cooler Graphics
- [ ] Music