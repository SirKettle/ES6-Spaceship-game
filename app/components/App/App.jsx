import styles from './_App.scss';

import React from 'react';
import Rx from 'rx';
import AppActions from '../../actions/AppActions';
import ItemsStore from '../../stores/ItemsStore';
import Body from '../Body/Body';
import Footer from '../Footer/Footer';
import Game from '../Game/Game';
import KeyboardService from '../../services/Keyboard';
import defaultKeyActions from '../../data/defaultKeyActions.json';
import gameUtils from '../../util/game';
import objectUtils from '../../util/object';

function getAppState() {
  return {
    items: ItemsStore.getAll(),
    keysDown: {}
  };
}

export default class App extends React.Component {

  state = getAppState();

  subscriptions = [];
  keyCodeActionMap = {};

  renderKeysDown = () => {
    return Object.keys(this.state.keysDown)
      .map( (keyCode) => {
        const { display, action } = this.state.keysDown[ keyCode ];

        action();
        return (
          <span>{ display }</span>
        );
      });
  }

  renderConsoleOutput = () => {
    // TODO: This needs to iterate through an array/object to output anything
    // needed in the console
    return (
      <div>
        <h3>Console</h3>
        <p>Keys down: <strong>{ this.renderKeysDown() }</strong></p>
      </div>
    );
  }

  componentDidMount() {
    ItemsStore.addChangeListener(this.onChange);
    AppActions.getItems();

    console.log(defaultKeyActions);

    const actions = {
      left: () => {
        console.log('go left');
      },
      right: () => {
        console.log('go right');
      },
      up: () => {
        console.log('move up');
      },
      down: () => {
        console.log('move down');
      },
      fire: () => {
        console.log('fire!');
      },
      pause: () => {
        console.log('pause');
      },
      roll: () => {
        console.log('roll - ' + gameUtils.rollDice());
      }
    };

    const getSafeKey = ( num ) => `key_${num}`;

    Object.keys( defaultKeyActions ).forEach( ( key ) => {
      const codes = defaultKeyActions[key];
      codes.forEach( ( code ) => {
        this.setActionByKeyCode( code, actions[key] );
      });
    });

    console.log(this.keyCodeActionMap);

    const { keysDown } = this.state || {};

    const keyBoardSubscription = KeyboardService.stream.subscribe( (event) => {
      const keyCode = event.key || event.which;
      const character = String.fromCharCode(keyCode);
      const actionFunc = this.getActionByKeyCode( keyCode );

      if ( !actionFunc ) { return; }

      if ( event.type === 'keyup' ) {
        delete keysDown[keyCode];
      }
      if ( event.type === 'keydown' ) {
        keysDown[keyCode] = {
          code: keyCode,
          display: character,
          action: actionFunc
        };

        // actionFunc();
      }

      event.preventDefault();

      this.setState({
        keysDown: keysDown
      })
    });

    this.subscriptions.push(keyBoardSubscription);
  }

  getActionByKeyCode = ( keyCode ) => {
    return this.keyCodeActionMap[ objectUtils.getSafeKey( keyCode ) ];
  }

  setActionByKeyCode = ( keyCode, actionFunc ) => {
    this.keyCodeActionMap[ objectUtils.getSafeKey( keyCode ) ] = actionFunc;
  }

  componentWillUnmount() {
    ItemsStore.removeChangeListener(this.onChange);
  }

  componentWillMount() {
  }

  componentWillUnmount() {

    this.subscriptions.forEach( ( subscription) => {
      subscription.dispose();
    });
  }

  onChange = () => {
    this.setState(getAppState());
  }

  render() {

    const gameState = {
      running: true,
      score: {
        score: 10
      },
      data: {
        somethings: [ 1, 2, 3 ],
        keysDown: this.state.keysDown
      }
    };

    const canvasConfig = {
      width: 600,
      height: 400
    };

    const onCanvasClicked = ( event ) => {
      console.log(event);
    };

        // <Body items={this.state.items} />
        // <Footer />
    return (
      <div className={styles.app}>
        <Game
          gameState={ gameState }
          canvas={ canvasConfig }
          onCanvasClicked={ onCanvasClicked }
        />
        <div class={ styles.console }>
          { this.renderConsoleOutput() }
        </div>
      </div>
    );
  }
}
