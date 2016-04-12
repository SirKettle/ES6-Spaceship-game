
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

  update ( delta  ) {

    // Turn to face target

    this.turnToward( delta, this.targetDirection );





    // Alter speed to got to target (maybe set to 200)
    if ( this.targetDistance > 600 ) {
      this.accelerate( delta );
    }
    else {
      this.decelerate( delta );
    }



    // move towards nearest target



    // Shoot
    gameUtils.doProbablyPerSeconds( delta, 2, () => {
      // const direction = gameUtils.getDirection( this.state, this.target );
      this.shoot( this.targetDirection );
    });

    super.update( delta );
  }
}

export default AiShip;
