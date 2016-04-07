
import Ship from './Ship';
import gameUtils from '../util/game';

class AiShip extends Ship {

  constructor ( canvas, props ) {

    const defaultProps = {
      _class: 'AiShip',
      type: 'shipType',
      name: 'Alien Saucer Class I',
      targets: []
    };

    super( canvas, Object.assign( {}, defaultProps, props ) );
  }

  update ( delta, defaultTarget ) {
    super.update( delta );

    const { targets } = this.state;
    const nearestTarget = defaultTarget;


    // Turn to face target

    // this.turnToward( delta, nearestTarget );



    // Alter speed to got to target (maybe set to 200)



    // move towards nearest target



    // Shoot
    gameUtils.doProbablyPerSeconds( delta, 2, () => {
      const direction = gameUtils.getDirection( this.state, nearestTarget );
      console.log(direction);
      this.shoot( direction );
    });

  }
}

export default AiShip;
