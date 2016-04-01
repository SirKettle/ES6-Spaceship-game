
import Rx from 'rx';
import objectUtils from '../util/object';

// TODO: remove event listeners

const bind = ( GameClock, keyActions ) => {
    // Lookup of key codes to timer ID, or null for no repeat
    //
    const actionIds = {};

    // When key is pressed and we don't already think it's pressed, call the
    // key action callback and set a timer to generate another one after a delay
    //
    document.onkeydown = ( event ) => {
        const key = objectUtils.getSafeKey( event.key || event.which );
        const keyAction = keyActions[key];

        if ( !keyAction || typeof keyAction.action !== 'function' ) {
          return;
        }

        if ( keyAction.onceOnly ) {
          const onceOnly = true;
          GameClock.addAction( keyAction.action, onceOnly );
          return;
        }

        if ( !actionIds[key] ) {
          actionIds[key] = GameClock.addAction( keyAction.action );
        }
    };

    // Cancel timeout and mark key as released on keyup
    //
    document.onkeyup = ( event ) => {
        const key = objectUtils.getSafeKey( event.key || event.which );
        if ( actionIds[key] ) {
          GameClock.removeAction( actionIds[key] );
          delete actionIds[key];
        }
    };

    // When window is unfocused we may not get key events. To prevent this
    // causing a key to 'get stuck down', cancel all held keys
    //
    window.onblur = ( event ) => {

      Object.keys( actionIds ).forEach( (key) => {
        if ( actionIds[key] !== null ) {
          GameClock.removeAction( actionIds[key] );
        }
        delete actionIds[key];
      });
    };
};

const KeyboardControls = {
  bind: bind
}

export default KeyboardControls;
