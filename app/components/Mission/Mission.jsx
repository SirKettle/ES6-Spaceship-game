import styles from './_Mission.scss';

import React from 'react';
import Footer from '../Footer/Footer';
import Ship from '../../class/Ship';
import GameComponent from '../Game/Game';
import KeyboardControls from '../../services/KeyboardControls';
import KeyboardActions from '../../services/KeyboardActions';
import MissionService from '../../services/Mission';
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

  gameClock = null

  updateGame ( delta, mission ) {

    const allShots = this.playerShip.state.shots; // .concat(blah.shots..)

    /* **** UPDATE THINGS **** */
    // update the Player ship
    this.playerShip.update( delta );

    // update the other ships
    mission.otherShips.forEach( ( thing ) => {
      thing.update( delta );
    });

    // update the shots
    allShots.forEach( ( shot ) => {
      shot.update( delta );
    });

    /* **** COLLISION DETECTION **** */
    // handle collisions between ships and ships
    mission.otherShips.forEach( ( thing ) => {
      gameUtils.handleCollision( thing, this.playerShip );
    });

    // handle collisions between shots and ships
    allShots.forEach( ( shot ) => {
      // TODO: how to handle shots fired by firer - currently destroys self!
      // this.handleCollision( shot, this.playerShip );
      mission.otherShips.forEach( ( thing ) => {
        gameUtils.handleCollision( thing, shot );
      });
    });

    // TODO: paint collisions
    // filter out dead ships after collisions
    mission.otherShips = mission.otherShips.filter( ( ship ) => {
      return ship.alive;
    });

    /* **** UPDATE THE GAME'S STATE **** */
    this.setState({
      hero: this.playerShip.state,
      enemies: mission.otherShips.map( ( ship ) => ship.state ),
      shots: allShots.map( ( shot ) => shot.state ),
      map: this.getMapState( mission )
    });
  }

  getMapState ( mission ) {

    const mapScale = 20;
    const mapSize = 0.25;
    const scaleFactor = ( 1 / mapScale ) * mapSize;
    const mapCanvas = {
      width: this.state.canvas.width * mapScale,
      height: this.state.canvas.height * mapScale
    };

    let otherShipsCoords = [];

    if ( this.state.showMap ) {
      otherShipsCoords = mission.otherShips.map( ( ship ) => {
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

  reset () {

  }

  save () {

  }

  // missionData could be the initial config or an
  // extended saved game
  loadMission ( id ) {

    this.reset();
    const missionData = MissionService.getMission( id );
    if ( !missionData ) { return; }

    const mission = {};
    const canvasConfig = {
      width: document.body.clientWidth,
      height: document.body.clientHeight
    };

    this.setState({
      canvas: canvasConfig
    });

    this.playerShip = new Ship(
      canvasConfig,
      Object.assign(
        {
          x: canvasConfig.width * 0.5,
          y: canvasConfig.height * 0.5
        },
        configs[ missionData.playerShip.type ],
        missionData.playerShip.settings
      )
    );

    mission.otherShips = missionData.ships.map( ( ship ) => {
      return new Ship(
        canvasConfig,
        Object.assign(
          {},
          configs[ ship.type ],
          ship.settings
        )
      );
    });

    this.gameClock = Game.Clock( missionData.timeLeft );
    this.gameClock.start();
    // add actions to keyboard events
    KeyboardControls.bind( this.gameClock, this.getKeyboardActions() );

    this.gameClock.addAction( ( delta ) => {
      this.updateGame( delta, mission );
    });
  }

  // react core methods

  componentWillUnmount () {

    this.gameClock.stop();
    this.gameClock = null;


    this.subscriptions.forEach( ( subscription) => {
      subscription.dispose();
    });
  }

  componentDidMount () {

    const missionId = this.props.location.query.id;
    if ( missionId ) {
      this.loadMission( missionId );
    }
  }

  render () {

    return null;

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
