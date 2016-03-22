
import Rx from 'rx';

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

const KeyboardService = {
  streams: {
    keyActions: keyActionsStream
  }
}

export default KeyboardService;
