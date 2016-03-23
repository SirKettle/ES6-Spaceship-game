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
      speed: 200
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


    const loopTime = 20;
    const { hero } = this.state;
    const { canvasConfig } = this.props;

    hero.x = 300;
    hero.y = 300;
    hero.shotCount = 0;

    const moveHero = ( hero, direction, delta = loopTime ) => {

      const distance = hero.speed * delta / 1000;
      let desiredPosition;

      switch (direction) {
        case 'left':
          desiredPosition = Math.max(0, hero.x - distance);
          hero.x = desiredPosition;
          break;
        case 'right':
          desiredPosition = Math.min(canvasConfig.width, hero.x + distance);
          hero.x = desiredPosition;
          break;
        case 'up':
          desiredPosition = Math.max(0, hero.y - distance);
          hero.y = desiredPosition;
          break;
        case 'down':
          desiredPosition = Math.min(canvasConfig.height, hero.y + distance);
          hero.y = desiredPosition;
          break;
      }


      this.setState({
        hero: hero
      });
    }

    const actions = {
      left: ( delta ) => {
        moveHero( hero, 'left', delta);
      },
      right: ( delta ) => {
        moveHero( hero, 'right', delta);
      },
      up: ( delta ) => {
        moveHero( hero, 'up', delta);
      },
      down: ( delta ) => {
        moveHero( hero, 'down', delta);
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

    let lastStreamUpdate = Date.now();

    // const keyBoardSubscription = KeyboardService.streams.keyActions.subscribe( (event) => {
    //   const streamTime = Date.now();
    //   const timeSinceLast = streamTime - lastStreamUpdate;
    //   lastStreamUpdate = streamTime;

    //   console.log(timeSinceLast);
    //   const keyCode = event.key || event.which;
    //   const character = String.fromCharCode(keyCode);
    //   const actionFunc = this.getActionByKeyCode( keyCode );

    //   if ( !actionFunc ) { return; }

    //   if ( event.type === 'keyup' ) {
    //     delete keysDown[keyCode];
    //   }
    //   if ( event.type === 'keydown' ) {
    //     keysDown[keyCode] = {
    //       code: keyCode,
    //       display: character,
    //       action: actionFunc
    //     };
    //   }

    //   event.preventDefault();

    //   this.setState({
    //     keysDown: keysDown
    //   });
    // });

    // const keyBoardSubscription = KeyboardService.streams.keyActions.subscribe( ( keysDown ) => {
    //   const streamTime = Date.now();
    //   const timeSinceLast = streamTime - lastStreamUpdate;
    //   lastStreamUpdate = streamTime;

    //   console.log(timeSinceLast, keysDown);
    //   // const keyCode = event.key || event.which;
    //   // const character = String.fromCharCode(keyCode);
    //   // const actionFunc = this.getActionByKeyCode( keyCode );

    //   // if ( !actionFunc ) { return; }

    //   // if ( event.type === 'keyup' ) {
    //   //   delete keysDown[keyCode];
    //   // }
    //   // if ( event.type === 'keydown' ) {
    //   //   keysDown[keyCode] = {
    //   //     code: keyCode,
    //   //     display: character,
    //   //     action: actionFunc
    //   //   };
    //   // }

    //   // event.preventDefault();

    //   // this.setState({
    //   //   keysDown: keysDown
    //   // });
    // });

    // debugger;

    KeyboardService.Controller(this.keyCodeActionMap, loopTime);

    // this.subscriptions.push(keyBoardSubscription);

    // window.setInterval(this.gameLoop, 10);
  }

  getActionByKeyCode = ( keyCode ) => {
    return this.keyCodeActionMap[ objectUtils.getSafeKey( keyCode ) ];
    // return this.keyCodeActionMap[ keyCode.toString() ];
  }

  setActionByKeyCode = ( keyCode, actionFunc ) => {
    this.keyCodeActionMap[ objectUtils.getSafeKey( keyCode ) ] = actionFunc;
    // this.keyCodeActionMap[ keyCode.toString() ] = actionFunc;
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
