
import Actor from './Actor';
import Shot from './Shot';
import gameUtils from '../util/game';

class Ship extends Actor {

  constructor ( canvas, props ) {

    const defaultProps = {
      _ready: true,
      type: 'enemy',
      name: 'Alien Saucer Class I',
      health: 1,
      power: 1,
      size: 100,
      speed: 0,
      acceleration: 200,
      breaking: 450,
      maxSpeed: 800,
      turnSpeed: 90,
      x: 0,
      y: 0,
      direction: 0,
      images: [],
      shotHealth: 1,
      shotPower: 0.1,
      shotSpeed: 900,
      shotLifeSpan: 1000,
      shots: []
    };

    super( canvas, props, defaultProps );
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

  shoot () {
    const { direction, speed, shotSpeed, shotPower } = this._state;
    const { x, y } = this.circle;
    const shot = new Shot( direction, x, y, speed + shotSpeed, shotPower, 2 );
    this._state.shots.push( shot );
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
      if ( shot.health <= 0 ) {
        return false;
      }
      return true;
    });

    this._state.image = this.image;
    this._state.circle = this.circle;
  }

}

export default Ship;
