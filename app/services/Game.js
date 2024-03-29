
import objectUtils from '../util/object';

class GameClock {

    constructor (  ) {
        this._isRunning = false;
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

    get fps () {
      return this.delta && Math.floor(1000 / this.delta);
    }

    get fpsAverage () {
      GameClock.fpsTally += this.fps;
      GameClock.fpsCheckCount += 1;
      return Math.floor(GameClock.fpsTally / GameClock.fpsCheckCount);
    }

    get isRunning () {
      return Boolean( this._isRunning );
    }
}

GameClock.fpsCheckCount = 0;
GameClock.fpsTally = 0;


 const Game = {
 	Clock: ( delta ) => {
 		return new GameClock( delta );
 	}
 };

 export default Game;
