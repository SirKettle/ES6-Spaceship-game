import styles from './_Mission.scss';

import React from 'react';
import Footer from '../Footer/Footer';
import Ship from '../../class/Ship';
import GameComponent from '../Game/Game';
import KeyboardControls from '../../services/KeyboardControls';
import KeyboardActions from '../../services/KeyboardActions';
import Game from '../../services/Game';
import gameUtils from '../../util/game';

import playerShipData from '../../data/playerShip.json';
import harrisonShipData from '../../data/harrisonShip.json';
import alienClass1Data from '../../data/alienClass1.json';
import alienClass2Data from '../../data/alienClass2.json';

const configs = {
  playerShip: Object.assign({}, playerShipData),
  harrisonShip: Object.assign({}, harrisonShipData),
  alienClass1: Object.assign({}, alienClass1Data),
  alienClass2: Object.assign({}, alienClass2Data)
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

export default class MissionComponent extends React.Component {

  state = {
    canvas: {},
    running: true,
    hero: {},
    enemies: [],
    shots: [],
    showGuides: true,
    showMap: true,
    score: {
      score: 0
    },
    map: {}
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
      shots: allShots.map( ( shot ) => shot.state ),
      map: this.getMapState()
    });
  }

  getMapState () {

    const mapScale = 20;
    const mapSize = 0.25;
    const scaleFactor = ( 1 / mapScale ) * mapSize;
    const mapCanvas = {
      width: this.state.canvas.width * mapScale,
      height: this.state.canvas.height * mapScale
    };

    let otherShipsCoords = [];

    if ( this.state.showMap ) {
      otherShipsCoords = this.otherShips.map( ( ship ) => {
        return {
          x: Math.floor( gameUtils.getXPositionOffset( ship.state, this.playerShip.state, mapCanvas ) * scaleFactor ),
          y: Math.floor( gameUtils.getYPositionOffset( ship.state, this.playerShip.state, mapCanvas ) * scaleFactor )
        }
      });
    }

    return {
      direction: this.playerShip.state.direction,
      ships: otherShipsCoords,
      width: Math.floor( mapCanvas.width * scaleFactor ),
      height: Math.floor( mapCanvas.height * scaleFactor )
    };
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
        this.setState({ showGuides: !this.state.showGuides }); // toggle guides
      },
      map: () => {
        this.setState({ showMap: !this.state.showMap }); // toggle map
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

    const canvasConfig = {
      width: document.body.clientWidth,
      height: document.body.clientHeight
    };

    this.setState({
      canvas: canvasConfig
    });

    this.gameClock = Game.Clock(20);

    const shipConfig = configs.harrisonShip;
    // const shipConfig = configs.playerShip;

    this.playerShip = new Ship( canvasConfig, Object.assign({}, shipConfig, {
      x: canvasConfig.width * 0.5,
      y: canvasConfig.height * 0.5,
      _ready: true
    }) );

    const enemy1 = new Ship( canvasConfig, Object.assign({}, configs.alienClass1, {
      x: 200,
      y: 300,
      speed: 40,
      direction: 135,
      _ready: true
    }) );

    const enemy2 = new Ship( canvasConfig, Object.assign({}, configs.alienClass2, {
      x: 500,
      y: 200,
      speed: 400,
      direction: 20,
      _ready: true
    }) );

    this.otherShips = [];
    this.otherShips.push( enemy1 );
    this.otherShips.push( enemy2 );

    this.gameClock.start();
    // add actions to keyboard events
    KeyboardControls.bind( this.gameClock, this.getKeyboardActions() );

    this.gameClock.addAction( ( delta ) => {
      this.updateGame( delta );
    });
  }

  render () {

    return (
      <div className={ styles.Mission }>
        <GameComponent
          hero={ this.state.hero }
          enemies={ this.state.enemies }
          shots={ this.state.shots }
          score={ this.state.score }
          map={ this.state.map }
          showGuides={ this.state.showGuides }
          showMap={ this.state.showMap }
          canvas={ this.state.canvas }
          onCanvasClicked={ this.onCanvasClicked }
        />
        <Footer />
      </div>
    );
  }
}
