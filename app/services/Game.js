
import objectUtils from '../util/object';

class GameClock {

    constructor ( delta = 20 ) {
        this.delta = delta;
        this.isRunning = false;
        this.actions = {};
        this.actionCount = 0;
        this.intervalId = null;
        this.lastTimeRun = Date.now();
    };

    static getKey( sdf ) {
        // Canvas drawing code
    };

    // public functions
    run () {
      const newTime = Date.now();
      this.delta = newTime - this.lastTimeRun;
      this.lastTimeRun = newTime;
      Object.keys(this.actions).forEach( ( actionKey ) => {
        const action = this.actions[ actionKey ];
        action( this.delta );
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
      this.isRunning = true;
      this.run();
    }

    pause () {
      // window.clearInterval(this.intervalId);
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
