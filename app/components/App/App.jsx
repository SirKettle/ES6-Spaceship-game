import styles from './_App.scss';

import React from 'react';
import Rx from 'rx';
import AppActions from '../../actions/AppActions';
import ItemsStore from '../../stores/ItemsStore';
import Body from '../Body/Body';
import Footer from '../Footer/Footer';
import Ship from '../../class/Ship';
import GameComponent from '../Game/Game';
import KeyboardControls from '../../services/KeyboardControls';
import KeyboardActions from '../../services/KeyboardActions';
import Game from '../../services/Game';
import gameUtils from '../../util/game';

import playerShipData from '../../data/playerShip.json';
import alienClass1Data from '../../data/alienClass1.json';

const configs = {
  playerShip: Object.assign({}, playerShipData),
  alienClass1: Object.assign({}, alienClass1Data)
};

const injectImages = ( config ) => {
  config.imageUrls.forEach( ( name ) => {
    const img =  document.createElement( 'img' );
    require( `file?!../../assets/${ name }` );
    img.src = `/assets/${ name }`;
    config.images.push( img );
  });

  return config;
};

Object.keys( configs ).forEach( ( key ) => {
  let config = configs[ key ];
  config = injectImages( config );
});

export default class App extends React.Component {

  static propTypes = {
    canvasConfig: React.PropTypes.shape({
      width: React.PropTypes.number,
      height: React.PropTypes.number
    })
  }

  state = {
    running: true,
    hero: {},
    enemies: [],
    shots: [],
    guides: false,
    score: {
      score: 0
    }
  }

  subscriptions = []

  playerShip = null

  otherShips = []

  updateGame ( delta ) {

    const allShots = this.playerShip.state.shots; // .concat(blah.shots..)

    /* **** UPDATE THINGS **** */
    // update the Player ship
    this.playerShip.update( delta );

    // update the other ships
    this.otherShips.forEach( ( thing ) => {
      thing.update( delta );
    });

    // update the shots
    allShots.forEach( ( shot ) => {
      shot.update( delta );
    });

    /* **** COLLISION DETECTION **** */
    // handle collisions between ships and ships
    this.otherShips.forEach( ( thing ) => {
      this.handleCollision( thing, this.playerShip );
    });

    // handle collisions between shots and ships
    allShots.forEach( ( shot ) => {
      // TODO: how to handle shots fired by firer - currently destroys self!
      // this.handleCollision( shot, this.playerShip );
      this.otherShips.forEach( ( thing ) => {
        this.handleCollision( thing, shot );
      });
    });

    // TODO: paint collisions
    // filter out dead ships after collisions
    this.otherShips = this.otherShips.filter( ( ship ) => {
      return ship.alive;
    });

    /* **** UPDATE THE GAME'S STATE **** */
    this.setState({
      hero: this.playerShip.state,
      enemies: this.otherShips.map( ( ship ) => ship.state ),
      shots: allShots.map( ( shot ) => shot.state )
    });
  }

  handleCollision = ( thing1, thing2 ) => {
    const isCollision = this.getIsCollision( thing1.circle, thing2.circle );

    if ( isCollision ) {
      thing1.hit( thing2 );
      thing2.hit( thing1 );
    }
  }

  getIsCollision = ( circle1, circle2 ) => {
    const dx = Math.abs( circle1.x - circle2.x );
    const dy = Math.abs( circle1.y - circle2.y );
    const distance = Math.sqrt( dx * dx + dy * dy );
    return Boolean( distance < ( circle1.radius + circle2.radius ) );
  }

  getKeyboardActions () {

    const gameActions = {
       pause: () => {
        console.log('pause toggle');
        this.gameClock.toggle();
      },
      roll: () => {
        console.log('roll - ' + gameUtils.rollDice());
      },
      guides: () => {
        const guidesOn = this.state.guides;

        // toggle guides
        this.setState({
          guides: !guidesOn
        });

        console.log('this.state.guides', this.state.guides);
      }
    };

    return KeyboardActions.getActions( this.playerShip, gameActions );
  }

  onCanvasClicked ( event ) {
      console.log( event );
  }

  // react core methods

  componentWillUnmount () {

    this.subscriptions.forEach( ( subscription) => {
      subscription.dispose();
    });
  }

  componentDidMount () {

    this.gameClock = Game.Clock(20);
    const { canvasConfig } = this.props;

    const initPlayerShipSettings = Object.assign({}, configs.playerShip, {
      x: canvasConfig.width * 0.5,
      y: canvasConfig.height * 0.5,
      _ready: true
    });

    this.playerShip = new Ship( canvasConfig, initPlayerShipSettings );

    const enemySettings = Object.assign({}, configs.alienClass1, {
      x: 200,
      y: 300,
      direction: 135,
      _ready: true
    });

    const enemy1 = new Ship( canvasConfig, enemySettings );

    this.otherShips = [];
    this.otherShips.push( enemy1 );

    this.gameClock.start();
    // add actions to keyboard events
    KeyboardControls.bind( this.gameClock, this.getKeyboardActions() );

    this.gameClock.addAction( ( delta ) => {
      this.updateGame( delta );
    });
  }

  render () {

    return (
      <div className={ styles.app }>
        <GameComponent
          hero={ this.state.hero }
          enemies={ this.state.enemies }
          shots={ this.state.shots }
          score={ this.state.score }
          guides={ this.state.guides }
          canvas={ this.props.canvasConfig }
          onCanvasClicked={ this.onCanvasClicked }
        />
      </div>
    );
  }
}
