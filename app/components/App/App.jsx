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
    items: ItemsStore.getAll()
  };
}

export default class App extends React.Component {

  static propTypes = {
    canvasConfig: React.PropTypes.shape({
      width: React.PropTypes.number,
      height: React.PropTypes.number
    })
  }

  state = {
    running: true,
    score: {
      score: 10
    },
    hero: {
      speed: 20
    },
    data: {
      somethings: [ 1, 2, 3 ]
    },
    keysDown: {}
  }

  subscriptions = [];
  keyCodeActionMap = {};

  renderKeysDown = () => {
    return Object.keys(this.state.keysDown)
      .map( (keyCode) => {
        const { display, action } = this.state.keysDown[ keyCode ];

        // action();
        return (
          <span key={ keyCode }>{ display }</span>
        );
      });
  }

  loopTime = Date.now();

  gameLoop = () => {

    const lastLoopTime = this.loopTime;
    this.loopTime = Date.now();

    const delta = this.loopTime - lastLoopTime;

    Object.keys(this.state.keysDown)
      .forEach( (keyCode) => {
        const { action } = this.state.keysDown[ keyCode ];
        action(delta);
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

    const { hero } = this.state;
    const { canvasConfig } = this.props;

    hero.x = 300;
    hero.y = 300;
    hero.shotCount = 0;

    const moveHero ( hero, direction, delta ) => {

      const distance = hero.speed * delta / 1000;

      switch (direction) {
        case 'left':
          const desiredPosition = hero.x - distance;
          hero.x = Math.max(0, desiredPosition);
        case 'right':
          const desiredPosition = hero.x + distance;
          hero.x = Math.min(canvasConfig.width, desiredPosition);
        case 'up':
          const desiredPosition = hero.y - distance;
          hero.y = Math.max(0, desiredPosition);
        case 'down':
          const desiredPosition = hero.y + distance;
          hero.y = Math.min(canvasConfig.width, desiredPosition);
      }

      return hero;
    }

    const actions = {
      left: ( delta ) => {
        hero = moveHero( hero, 'left', delta);
      },
      right: ( delta ) => {
        hero = moveHero( hero, 'right', delta);
      },
      up: ( delta ) => {
        hero = moveHero( hero, 'up', delta);
      },
      down: ( delta ) => {
        hero = moveHero( hero, 'down', delta);
      },
      fire: ( delta ) => {
        // console.log('fire!');
        hero.shotCount++;
        console.log('hero.shotCount', hero.shotCount);
      },
      pause: () => {
        console.log('pause');
      },
      roll: () => {
        console.log('roll - ' + gameUtils.rollDice());
      }
    };

    this.setState({
      hero: hero
    });


    const getSafeKey = ( num ) => `key_${num}`;

    Object.keys( defaultKeyActions ).forEach( ( key ) => {
      const codes = defaultKeyActions[key];
      codes.forEach( ( code ) => {
        this.setActionByKeyCode( code, actions[key] );
      });
    });

    console.log(this.keyCodeActionMap);

    const { keysDown } = this.state || {};

    const keyBoardSubscription = KeyboardService.streams.keyActions.subscribe( (event) => {
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
      }

      event.preventDefault();

      this.setState({
        keysDown: keysDown
      });
    });

    this.subscriptions.push(keyBoardSubscription);

    window.setInterval(this.gameLoop, 500);
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

    const onCanvasClicked = ( event ) => {
      console.log(event);
    };

        // <Body items={this.state.items} />
        // <Footer />
    return (
      <div className={styles.app}>
        <Game
          gameState={ this.state }
          canvas={ this.props.canvasConfig }
          onCanvasClicked={ onCanvasClicked }
        />
        <div class={ styles.console }>
          { this.renderConsoleOutput() }
        </div>
      </div>
    );
  }
}
