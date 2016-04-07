
import DumbObject from './DumbObject';

class SpaceStation extends DumbObject {

  constructor ( canvas, props ) {

    const defaultProps = {
      _class: 'SpaceStation',
      type: 'spaceStation',
      name: 'Space Station',
      health: 100000,
      power: -0.005, // This should result in increasing health while in collision
      size: 300
    };

    super( canvas, props, defaultProps );
  }
}

export default SpaceStation;
