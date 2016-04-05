
import objectUtils from '../util/object';

class GameClock {

    constructor ( delta = 20 ) {
        this._isRunning = false;
        this.delta = delta;
        this.actions = {};
        this.actionCount = 0;
        this.intervalId = null;
        this.lastTimeRun = Date.now();
    };

    // public functions
    run () {
      const newTime = Date.now();
      this.delta = newTime - this.lastTimeRun;
      this.lastTimeRun = newTime;
      Object.keys(this.actions).forEach( ( actionKey ) => {
        const action = this.actions[ actionKey ];
        action.action( this.delta );

        if ( action.onceOnly ) {
          this.removeAction( actionKey );
        }
      } );
      if (this.isRunning) {
        window.requestAnimationFrame( () => {
          this.run();
        });
      }
    }

    toggle () {
      this[ this.isRunning ? 'pause' : 'start' ]();
    }

    start () {
      // this.intervalId = window.setInterval( () => {
      // }, this.delta );
      this._isRunning = true;
      this.lastTimeRun = Date.now();
      this.run();
    }

    pause () {
      // window.clearInterval(this.intervalId);
      this._isRunning = false;
    }

    stop () {
      this.pause();
      this.resetActions();
    }

    addAction ( action, onceOnly = false, alwaysRun = false ) {
      if ( alwaysRun ) {
        action();
        return;
      }
      if ( !this.isRunning ) { return; }
      this.actionCount++;
      const actionKey = objectUtils.getSafeKey( this.actionCount );
      this.actions[ actionKey ] = {
        action: action,
        onceOnly: onceOnly
      };
      return actionKey;
    }

    removeAction ( actionKey ) {
      delete this.actions[ actionKey ];
    }

    resetActions () {
      this.actions = {};
    }

    set delta ( dt ) {
      this._delta = dt;
    }

    get delta () {
      return this._delta;
    }

    get isRunning () {
      return Boolean( this._isRunning );
    }
}

 const Game = {
 	Clock: ( delta ) => {
 		return new GameClock( delta );
 	}
 };

 export default Game;
