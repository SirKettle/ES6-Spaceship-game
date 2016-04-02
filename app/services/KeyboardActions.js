import objectUtils from '../util/object';
import defaultKeyActions from '../data/defaultKeyActions.json';

const KeyboardActions = {
  getActions: ( ship, gameActions ) => {

    const keyCodeActionMap = {};

    const shipActions = {
      left: ( delta ) => {
        ship.turnLeft( delta );
      },
      right: ( delta ) => {
        ship.turnRight( delta );
      },
      strafeLeft: ( delta ) => {
        ship.strafeLeft( delta );
      },
      strafeRight: ( delta ) => {
        ship.strafeRight( delta );
      },
      up: ( delta ) => {
        ship.accelerate( delta );
      },
      down: ( delta ) => {
        ship.decelerate( delta );
      },
      fire: ( delta ) => {
        console.log('fire!');
        ship.shoot();
      }
    };

    const actions = Object.assign({}, shipActions, gameActions);

    const assignKeyCodeActions = ( keyCodes, actionKey, onceOnly = false ) => {
      keyCodes.forEach( ( keyCode ) => {
        keyCodeActionMap[ objectUtils.getSafeKey( keyCode ) ] = {
          onceOnly: onceOnly,
          action: actions[ actionKey ]
        };
      });
    }

    // assign the repeating key actions - ie left, fire...
    Object.keys( defaultKeyActions.repeating ).forEach( ( actionKey ) => {
      const keyCodes = defaultKeyActions.repeating[ actionKey ];
      assignKeyCodeActions( keyCodes, actionKey, false );
    });

    // assign the once only key actions - ie pause, guides...
    Object.keys( defaultKeyActions.onceOnly ).forEach( ( actionKey ) => {
      const keyCodes = defaultKeyActions.onceOnly[ actionKey ];
      assignKeyCodeActions( keyCodes, actionKey, true );
    });

    return keyCodeActionMap;
  }
};

export default KeyboardActions;
