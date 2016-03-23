
import Rx from 'rx';

var SPEED = 40;
var SHOOTING_FREQ = 250;
var SHOOTING_SPEED = 15;
var ENEMY_FREQ = 1500;
var ENEMY_SHOOTING_FREQ = 750;
var SCORE_INCREASE = 10;
var HERO_Y = canvas.height - 30;

/* Helper functions */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function colision(target1, target2) {
  return (target1.x > target2.x - 20 && target1.x < target2.x + 20) &&
         (target1.y > target2.y - 20 && target1.y < target2.y + 20);
}

function gameOver(player, enemies) {
  return enemies.some(function(enemy) {
    if (colision(player, enemy)) {
      return true;
    }

    return enemy.shots.some(function(shot) {
      return colision(player, shot);
    });
  });
}

/* Reactive code */

var playerShots = Rx.Observable.merge(
  Rx.Observable.fromEvent(canvas, 'click'),
  Rx.Observable.fromEvent(document, 'keydown')
    .filter(function(evt) {
      return evt.keyCode === 32;
    })
);

var StarStream = Rx.Observable.range(1, 250)
  .map(function() {
    return {
      x: parseInt(Math.random() * canvas.width),
      y: parseInt(Math.random() * canvas.height),
      size: Math.random() * 3 + 1
    };
  })
  .toArray()
  .flatMap(function(arr) {
    return Rx.Observable.interval(SPEED).map(function() {
      return arr.map(function(star) {
        if (star.y >= canvas.height) {
          star.y = 0;
        }
        star.y += 3;
        return star;
      });
    });
  });

var mouseMove = Rx.Observable.fromEvent(canvas, 'mousemove');
var SpaceShip = mouseMove
  .map(function(event) {
    return {x: event.clientX, y: HERO_Y};
  })
  .startWith({x: canvas.width / 2, y: HERO_Y});

var playerFiring = playerShots
  .startWith({})
  .sample(200)
  .timestamp();

var HeroShots = Rx.Observable.combineLatest(
  playerFiring,
  SpaceShip,
  function(shotEvents, spaceShip) {
    return {
      timestamp: shotEvents.timestamp,
      x: spaceShip.x
    };
  })
  .distinct(function(shot) { return shot.timestamp; })
  .scan(function(shotArray, shot) {
    shotArray.push({ x:shot.x, y: HERO_Y });
    return shotArray.filter(isVisible);
  }, []);

var Enemies = Rx.Observable.interval(ENEMY_FREQ)
  .scan(function(enemyArray) {
    var enemy = {
      x: parseInt(Math.random() * canvas.width),
      y: -30,
      shots: []
    };

    Rx.Observable.interval(ENEMY_SHOOTING_FREQ).subscribe(function() {
      if (!enemy.isDead) {
        enemy.shots.push({ x: enemy.x, y: enemy.y });
      }
      enemy.shots = enemy.shots.filter(isVisible);
    });

    return enemyArray
      .concat(enemy)
      .filter(function(enemy) {
        return isVisible(enemy) && !(enemy.isDead && enemy.shots.length === 0);
      });
  }, []);


var GameLoop = Rx.Observable
  .combineLatest(StarStream, SpaceShip, Enemies, HeroShots,
    function(stars, spaceship, enemies, heroShots) {
      return {
        stars: stars,
        spaceship: spaceship,
        enemies: enemies,
        heroShots: heroShots
      };
    })
  .sample(SPEED)
  .takeWhile(function(actors) {
    var isGameOver = gameOver(actors.spaceship, actors.enemies);
    if (isGameOver === true) {
      actors.enemies.forEach(function(enemy) {
        enemy.isDead = true;
      });
    }
    return isGameOver === false;
  });

class Game {
	constructor ( canvas ) {
		this.canvas = canvas;
	}
}

 const GameService = {
 	loopStream: GameLoop,
 	Game: ( canvas ) => {
 		return new Game( canvas );
 	}
 };

 export default GameService;