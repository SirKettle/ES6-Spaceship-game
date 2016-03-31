
import gameUtils from '../util/game';

class Shot {

  constructor ( direction, x, y, speed = 1000, power = 0.3, health = 0.1, size = 6, color = '#ffff00' ) {
    this._state = {
      direction: direction,
      speed: speed,
      power: power,
      health: health,
      size: size,
      color: color,
      x: x,
      y: y
    };
  }

  getPosition ( delta, x, y, direction, speed ) {
    const radians = gameUtils.degreesToRadians( direction );

    // calc distance to travel
    const distance = speed * delta / 1000;
    const distanceX = Math.sin( radians ) * distance;
    const distanceY = Math.cos( radians ) * distance;

    return {
      x: x + distanceX,
      y: y - distanceY
    }
  }

  hit ( thing ) {
    // collisions handled outside the Hero class
    this._state.health -= thing.power;
  }

  getCircle () {
    const { x, y, size } = this._state;
    return {
      radius: size * 0.5,
      x: x,
      y: y
    };
  }

  update ( delta ) {
    const { x, y, direction, speed } = this._state;
    // get new coords
    const pos = this.getPosition( delta, x, y, direction, speed );
    // update the state
    this._state.x = pos.x;
    this._state.y = pos.y;
  }

  get power () {
    return this._state.power;
  }

  get state () {
    return this._state;
  }

  get alive () {
    return this._state.health > 0; 
  }
}

class Hero {

  constructor ( canvas, direction = 0, x = 0, y = 0, health = 1 ) {
    this._canvas = canvas;
    this._state = {
      direction: direction,
      speed: 0, // px/s
      acceleration: 100, // px/s
      breaking: 200, // px/s
      maxSpeed: 400, // px/s
      turnSpeed: 100, // deg/s
      x: x,
      y: y,
      // needed for collision and shots etc..
      width: 100,
      height: 109,
      // every thing has health and power
      health: health,
      power: 1,
      // shooting power/speed
      shotSpeed: 900, // px/s
      shotPower: 0.5, // px/s
      shots: []
    };

  }

  getAnimation () {
    if ( this._state.collision ) {
      return 'collision.png';
    }

    const speedSegments = 5;
    const speedIndex = Math.round( this._state.speed / this._state.maxSpeed * ( speedSegments - 1 ) );
    return speedIndex;
  }

  accelerate ( delta, faster = true ) {
    const prevSpeed = this._state.speed;
    const accelerateBy = this._state.acceleration / delta;
    const breakBy = this._state.breaking / delta;
    let newSpeed;

    if ( faster ) {
      newSpeed = Math.min( this._state.maxSpeed, prevSpeed + accelerateBy );
    }
    else {
      newSpeed = Math.max( 0, prevSpeed - breakBy );
    }
    // set new speed
    this._state.speed = newSpeed;
  }

  decelerate ( delta ) {
    this.accelerate( delta, false );
  }

  turnLeft ( delta ) {
    const prevDirection = this._state.direction;
    const turnBy = this._state.turnSpeed / delta;
    let newDirection = prevDirection - turnBy;

    if ( newDirection < 0 ) {
      newDirection = 360 - newDirection;
    }
    // set new direction
    this._state.direction = newDirection;
  }

  turnRight ( delta ) {
    const prevDirection = this._state.direction;
    const turnBy = this._state.turnSpeed / delta;
    const newDirection = ( prevDirection + turnBy ) % 360;
    // set new direction
    this._state.direction = newDirection;
  }

  hit ( thing ) {
    // collisions handled outside the Hero class
    this._state.health -= thing.power;
  }

  shoot () {
    const { direction, speed, shotSpeed, shotPower } = this._state;
    const x = this.getCircle().x;
    const y = this.getCircle().y;
    const shot = new Shot( direction, x, y, speed + shotSpeed, shotPower );
    this._state.shots.push( shot );
  }

  getPosition ( delta, x, y, direction, speed ) {
    const radians = gameUtils.degreesToRadians( direction );

    // calc distance to travel
    const distance = speed * delta / 1000;
    const distanceX = Math.sin( radians ) * distance;
    const distanceY = Math.cos( radians ) * distance;

    return {
      x: x + distanceX,
      y: y - distanceY
    }
  }

  getCircle () {
    const { x, y, width, height } = this._state;
    return {
      radius: width + height * 0.25,
      x: x + width * 0.5,
      y: y + height * 0.5
    };
  }

  update ( delta ) {
    const { x, y, direction, speed } = this._state;
    // get new coords
    const heroPos = this.getPosition( delta, x, y, direction, speed );
    // update the state
    this._state.x = heroPos.x;
    this._state.y = heroPos.y;

    this._state.shots = this._state.shots.filter( ( shotInstance ) => {
      const shot = shotInstance.state;
      if ( shot.x > this._canvas.width ||
          shot.x < 0 ||
          shot.y > this._canvas.height ||
          shot.y < 0 ) {
        return false;
      }

      if ( shot.health <= 0 ) {
        return false; 
      }

      return true;
    });


    // update the animation / image
    this._state.animation = this.getAnimation();
  }

  get power () {
    return this._state.power;
  }

  get state () {
    return this._state;
  }

  get alive () {
    return this._state.health > 0; 
  }

}

export default Hero;
