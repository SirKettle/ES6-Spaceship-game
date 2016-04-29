
import objectUtils from '../util/object';

class KeyboardController {

  constructor ( GameClock, keyActions ) {
    this.GameClock = GameClock;
    this.keyActions = keyActions;

    this.onKeyDownBound = this.onKeyDown.bind( this );
    this.onKeyUpBound = this.onKeyUp.bind( this );
    this.onBlurBound = this.onBlur.bind( this );
  }

  onKeyDown ( event ) {
    const key = objectUtils.getSafeKey( event.key || event.which );
    const keyAction = this.keyActions[key];

    if ( !keyAction || typeof keyAction.action !== 'function' ) {
      return;
    }

    if ( keyAction.preventDefault ) {
      event.preventDefault();
    }

    if ( keyAction.onceOnly ) {
      this.GameClock.addAction( keyAction.action, keyAction.onceOnly, keyAction.alwaysRun );
      return;
    }

    if ( !this.actionIds[key] ) {
      this.actionIds[key] = this.GameClock.addAction( keyAction.action );
    }
  }

  onKeyUp ( event ) {
    const key = objectUtils.getSafeKey( event.key || event.which );
    if ( this.actionIds[key] ) {
      event.preventDefault();
      this.GameClock.removeAction( this.actionIds[key] );
      delete this.actionIds[key];
    }
  }

  onBlur ( event ) {
    Object.keys( this.actionIds ).forEach( (key) => {
      if ( this.actionIds[key] !== null ) {
        this.GameClock.removeAction( this.actionIds[key] );
      }
      delete this.actionIds[key];
    });
  }

  bind () {
    this.actionIds = {};
    window.document.addEventListener( 'keydown', this.onKeyDownBound, false );
    window.document.addEventListener( 'keyup', this.onKeyUpBound, false );
    window.addEventListener( 'blur', this.onBlurBound, false );
  }

  unbind () {
    window.document.removeEventListener( 'keydown', this.onKeyDownBound, false );
    window.document.removeEventListener( 'keyup', this.onKeyUpBound, false );
    window.removeEventListener( 'blur', this.onBlurBound, false );
  }
}

export default KeyboardController;
