
import objectUtils from '../util/object';

class GameClock {

    constructor ( delta = 20 ) {
        this.delta = delta;
        this.isRunning = false;
        this.actions = {};
        this.actionCount = 0;
        this.intervalId = null;
    };

    static getKey( sdf ) {
        // Canvas drawing code
    };

    // public functions
    run () {
      Object.keys(this.actions).forEach( ( actionKey ) => {
        const action = this.actions[ actionKey ];
        action( this.delta );
      } );
    }

    toggle () {
      this[ this.isRunning ? 'pause' : 'start' ]();
    }

    start () {
      this.intervalId = window.setInterval( () => {
        this.run();
      }, this.delta );
      this.isRunning = true;
    }

    pause () {
      window.clearInterval(this.intervalId);
      this.isRunning = false;
    }

    stop () {
      this.pause();
      this.resetActions();
    }

    addAction ( action ) {
      if ( !this.isRunning ) { return; }
      this.actionCount++;
      const actionKey = objectUtils.getSafeKey( this.actionCount );
      this.actions[ actionKey ] = action;
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
}

 const Game = {
 	Clock: ( delta ) => {
 		return new GameClock( delta );
 	}
 };

 export default Game;
