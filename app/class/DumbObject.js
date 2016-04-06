import Actor from './Actor';

class DumbObject extends Actor {

  constructor ( canvas, props ) {

    const defaultProps = {
      _class: 'DumbObject',
      type: '_dumb',
      name: 'Dumb object',
      health: 1,
      power: 1
    };

    super( canvas, props, defaultProps );
  }
}

export default DumbObject;
