import gameUtils from '../util/game';
import Actor from './Actor';

class Shot extends Actor {

  constructor ( canvas, props ) {

    const defaultProps = {
      _class: 'Shot',
      type: 'shot',
      name: 'ship gun shot',
      speed: 1000,
      health: 1,
      power: 1, // This should result in increasing health while in collision
      size: 6,
      lifeSpan: 300,
      color: '#ffff00'
    };

    super( canvas, props, defaultProps );
  }

  update ( delta ) {
    super.update( delta );
    this._state.health -= delta / this._state.lifeSpan;
  }
}

export default Shot;
