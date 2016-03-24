import styles from './_App.scss';

import React from 'react';
import Rx from 'rx';
import AppActions from '../../actions/AppActions';
import ItemsStore from '../../stores/ItemsStore';
import Body from '../Body/Body';
import Footer from '../Footer/Footer';
import Game from '../Game/Game';
import Keyboard from '../../services/Keyboard';
import GameService from '../../services/Game';
import Hero from '../../class/Hero';
import defaultKeyActions from '../../data/defaultKeyActions.json';
import gameUtils from '../../util/game';
import objectUtils from '../../util/object';

// const GameInstance = GameService.initGame();

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

    console.log(defaultKeyActions);


    const loopTime = 20;
    const { canvasConfig } = this.props;

    const initialHeroSettings = {
      direction: 0,
      x: canvasConfig.width / 2,
      y: canvasConfig.height / 2
    }

    const hero = new Hero(
      initialHeroSettings.direction,
      initialHeroSettings.x,
      initialHeroSettings.y
    );

    const actions = {
      left: ( delta = loopTime ) => {
        hero.turnLeft( delta );
      },
      right: ( delta = loopTime ) => {
        hero.turnRight( delta );
      },
      up: ( delta = loopTime ) => {
        hero.accelerate( delta );
      },
      down: ( delta = loopTime ) => {
        hero.decelerate( delta );
      },
      fire: ( delta = loopTime ) => {
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

    Keyboard.Controller(this.keyCodeActionMap, loopTime);

    setInterval(() => {
      hero.update(loopTime);
      this.setState({
        hero: hero.state
      });
    }, loopTime);
  }

  getActionByKeyCode = ( keyCode ) => {
    return this.keyCodeActionMap[ objectUtils.getSafeKey( keyCode ) ];
  }

  setActionByKeyCode = ( keyCode, actionFunc ) => {
    this.keyCodeActionMap[ objectUtils.getSafeKey( keyCode ) ] = actionFunc;
  }

  componentWillUnmount() {

    this.subscriptions.forEach( ( subscription) => {
      subscription.dispose();
    });
  }

  render() {

    const onCanvasClicked = ( event ) => {
      console.log(event);
    };

    return (
      <div className={styles.app}>
        <Game
          hero={ this.state.hero }
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
