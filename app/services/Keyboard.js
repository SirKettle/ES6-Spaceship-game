
import Rx from 'rx';

const keyDowns = Rx.Observable.fromEvent(document, 'keydown');
const keyUps = Rx.Observable.fromEvent(document, 'keyup');
const keyActions = Rx.Observable
  .merge( keyDowns, keyUps )
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
  stream: keyActions
}

export default KeyboardService;
