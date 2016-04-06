
import DumbObject from './DumbObject';

class SpaceStation extends DumbObject {

  constructor ( canvas, props ) {

    const defaultProps = {
      _ready: true,
      _class: 'SpaceStation',
      type: 'station',
      name: 'Space Station',
      health: 100000,
      power: -1, // This should result in increasing health while in collision
      size: 300,
      speed: 0,
      x: 0,
      y: 0,
      images: [],
      imageUrls: []
    };

    super( canvas, props, defaultProps );
  }
}

export default SpaceStation;
