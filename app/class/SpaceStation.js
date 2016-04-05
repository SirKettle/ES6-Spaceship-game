
import Actor from './Actor';
import Shot from './Shot';
import gameUtils from '../util/game';

class SpaceStation extends DumbObject {

  constructor ( canvas, props ) {

    const defaultProps = {
      _ready: true,
      type: 'station',
      name: 'Space Station',
      health: 100000,
      power: -1, // This should result in increasing health while in collision
      size: 300,
      speed: 0,
      x: 0,
      y: 0
    };

    super( canvas, props, defaultProps );
  }
}

export default SpaceStation;

class DumbObject extends Actor {

  constructor ( canvas, props ) {

    const defaultProps = {
      _ready: true,
      type: '_dumb',
      name: 'Dumb object',
      health: 1,
      power: 1,
      size: 100,
      speed: 0,
      x: 0,
      y: 0
    };

    super( canvas, props, defaultProps );
  }

  update ( delta ) {
    const { x, y, direction, speed } = this._state;
    // get new coords
    const pos = this.getPosition( delta, x, y, direction, speed );
    // update the state
    this._state.x = pos.x;
    this._state.y = pos.y;
  }
}

export default DumbObject;
