
import Rx from 'rx';
import objectUtils from '../util/object';

const keyDownsStream = Rx.Observable.fromEvent(document, 'keydown');
const keyUpsStream = Rx.Observable.fromEvent(document, 'keyup');
const keyActionsStream = Rx.Observable
  .merge( keyDownsStream, keyUpsStream )
  .filter( () => {
    const keysPressed = {};
    return ( event ) => {
      const key = event.key || event.which;
      if ( event.type === 'keyup' ) {
        delete keysPressed[key];
        return true;
      }
      if ( event.type === 'keydown' ) {
        if ( keysPressed[key] ) {
          return false;
        }
        keysPressed[key] = true;
        return true;
      }
    };
  });

const allKeysDownStream = Rx.Observable.create( ( observer ) => {

  const allKeysDown = {};

  const onKeyDown = ( event ) => {
    const keyCode = event.key || event.which;
    allKeysDown[keyCode] = true;
    observer.onNext(allKeysDown);
  };
  const onKeyUp = ( event ) => {
    const keyCode = event.key || event.which;
    delete allKeysDown[keyCode];
    observer.onNext(allKeysDown);
  };

  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);




  // Any cleanup logic might go here
  return () => {
    console.log('disposed');

    document.removeEventListener('keydown', onKeyDown, false);
    document.removeEventListener('keyup', onKeyUp, false);
  };
});

const KeyboardControl = ( GameClock, keyActions) => {
    // Lookup of key codes to timer ID, or null for no repeat
    //
    const actionIds = {};

    // When key is pressed and we don't already think it's pressed, call the
    // key action callback and set a timer to generate another one after a delay
    //
    document.onkeydown = ( event ) => {
        const key = objectUtils.getSafeKey( event.key || event.which );
        const keyAction = keyActions[key];

        if ( typeof keyAction !== 'function' ) {
          return;
        }

        if ( !actionIds[key] ) {
          actionIds[key] = GameClock.addAction(keyAction);
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

const Keyboard = {
  streams: {
    keyActions: keyActionsStream,
    allKeysDown: allKeysDownStream
  },
  Controller: KeyboardControl
}

export default Keyboard;
