


class Game {
	constructor () {
    window.setInterval( () => {
      this.callActions();
    }, this.delta );
	}

  loopActions = {

  }

  delta = 20;

  callActions () {
    Object.keys(this.loopActions).forEach( ( actionKey ) => {
      const action = this.loopActions[ actionKey ];
      action();
    } );
  }

  addToLoop = ( action ) => {
    const actionKey = getUID();
    this.loopActions[actionKey] = action;
    return actionKey;
  }

  removeLoopAction = ( actionKey ) => {
    delete this.loopActions[actionKey];
  }
}

const GameService = () => {
  initGame: () => {
    return new Game();
  }
};







export default GameService;
