
import gameUtils from '../util/game';

class Hero {

  constructor ( direction = 0, x = 0, y = 0, health = 1 ) {
    this._state = {
      direction: direction,
      speed: 0, // px/s
      acceleration: 20, // px/s
      maxSpeed: 200, // px/s
      turnSpeed: 90, // deg/s
      x: x,
      y: y,
      health: health
    };
  }

  getAnimation () {
    if ( this._state.collision ) {
      return 'collision.png';
    }

    const speedSegments = 5;
    const speedIndex = Math.round( this._state.speed / this._state.maxSpeed * ( speedSegments - 1 ) );
    return `moving_speed_${ speedIndex }.png`;
  }

  accelerate ( delta, faster = true ) {
    const prevSpeed = this._state.speed;
    const accelerateBy = this._state.acceleration / delta;
    let newSpeed;

    if ( faster ) {
      newSpeed = Math.min( this._state.maxSpeed, prevSpeed + accelerateBy );
    }
    else {
      newSpeed = Math.max( 0, prevSpeed - accelerateBy );
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

  collision () {
    // collisions handled outside the Hero class
    this._state.collision = true;
  }

  update ( delta, collision = false ) {
    // calc distance to travel
    const distance = this._state.speed * delta / 1000;
    const radians = gameUtils.degreesToRadians( this._state.direction );
    const distanceX = Math.sin( radians ) * distance;
    const distanceY = Math.cos( radians ) * distance;

    // update the coords
    this._state.x += distanceX;
    this._state.y -= distanceY;

    // update the animation / image
    this._state.animation = this.getAnimation();
  }

  get state () {
    return this._state;
  }

}

export default Hero;
