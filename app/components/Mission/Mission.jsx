import styles from './_Mission.scss';

import React from 'react';
import Footer from '../Footer/Footer';
import Actor from '../../class/Actor';
import DumbObject from '../../class/DumbObject';
import SpaceStation from '../../class/SpaceStation';
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
import spaceStationData from '../../data/spaceStation.json';
import frozenMoonData from '../../data/frozenMoon.json';

const configs = {
  playerShip: Object.assign({}, playerShipData),
  harrisonShip: Object.assign({}, harrisonShipData),
  alienClass1: Object.assign({}, alienClass1Data),
  alienClass2: Object.assign({}, alienClass2Data),
  frozenMoon: Object.assign({}, frozenMoonData),
  spaceStation: Object.assign({}, spaceStationData)
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
    actors: [],
    shots: [],
    showGuides: true,
    showMap: true,
    stats: [],
    score: {
      score: 0
    },
    map: {}
  }

  subscriptions = []

  playerShip = null

  mission = null

  gameClock = null

  updateGame ( delta ) {

    const allShots = this.playerShip.state.shots; // .concat(blah.shots..)

    /* **** UPDATE THINGS **** */
    // update the Player ship
    this.playerShip.update( delta );

    // update the other ships
    this.mission.actors.forEach( ( thing ) => {
      thing.update( delta );
    });

    // update the shots
    allShots.forEach( ( shot ) => {
      shot.update( delta );
    });

    /* **** COLLISION DETECTION **** */
    // handle collisions between ships and ships
    this.mission.actors.forEach( ( thing ) => {
      gameUtils.handleCollision( thing, this.playerShip, delta );
    });

    // handle collisions between shots and ships
    allShots.forEach( ( shot ) => {
      // TODO: how to handle shots fired by firer - currently destroys self!
      // this.handleCollision( shot, this.playerShip, delta );
      this.mission.actors.forEach( ( thing ) => {
        gameUtils.handleCollision( thing, shot, delta );
      });
    });

    // TODO: paint collisions
    // filter out dead ships after collisions
    this.mission.actors = this.mission.actors.filter( ( actor ) => {
      return actor.alive;
    });

    /* **** UPDATE THE GAME'S STATE **** */
    this.setState({
      hero: this.playerShip.state,
      actors: this.mission.actors.map( ( actor ) => actor.state ),
      shots: allShots.map( ( shot ) => shot.state ),
      map: this.getMapState(),
      stats: this.getStats()
    });
  }

  getStats () {
    const stats = [];

    stats.push({ label: 'Health', value: this.playerShip.health });

    return stats;
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
      otherShipsCoords = this.mission.actors.map( ( actor ) => {
        return {
          x: Math.floor( gameUtils.getXPositionOffset( actor.state, this.playerShip.state, mapCanvas ) * scaleFactor ),
          y: Math.floor( gameUtils.getYPositionOffset( actor.state, this.playerShip.state, mapCanvas ) * scaleFactor )
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
      save: () => {
        console.log('try save now');
      },
      guides: () => {
        if (! this.gameClock.isRunning ) { return; }
        this.setState({ showGuides: !this.state.showGuides }); // toggle guides
      },
      map: () => {
        if (! this.gameClock.isRunning ) { return; }
        this.setState({ showMap: !this.state.showMap }); // toggle map
      }
    };

    return KeyboardActions.getActions( this.playerShip, gameActions );
  }

  reset () {
    clearInterval(this.timerId);
    this.timerId = null;
  }

  timerId = null

  save ( name ) {

    const stripImages = ( state ) => {
      const copy = Object.assign({}, state);
      delete copy.images;
      return copy;
    };

    MissionService.save( name, {
      playerShip: stripImages( this.playerShip.state ),
      actors: this.mission.actors.map( ( actor ) => {
        return stripImages( actor.state );
      })
    })
  }

  onSaveClicked ( event ) {

    const { inputSaveMission } = this.refs;
    console.log( event, inputSaveMission && inputSaveMission.value );
    if ( inputSaveMission && inputSaveMission.value ) {
      this.save( inputSaveMission.value );
    }
  }

  onCanvasClicked ( event ) {
    console.log( event );
  }

  // missionData could be the initial config or an
  // extended saved game
  loadMission ( missionKey ) {

    this.reset();
    const missionData = MissionService.load( missionKey );
    if ( !missionData ) { return; }

    this.mission = {};
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
        missionData.playerShip
      )
    );

    const getClass = ( classKey ) => {
      const classMap = {
        'Ship': Ship,
        'SpaceStation': SpaceStation,
        'DumbObject': DumbObject,
        'Actor': Actor
      };

      return classMap[ classKey ];
    };


    this.mission.actors = missionData.actors.map( ( thing ) => {
      const ClassType = getClass( thing._class );
      return new ClassType(
        canvasConfig,
        Object.assign(
          {},
          configs[ thing.type ],
          thing
        )
      );
    });

    // this.mission.otherShips = missionData.ships.map( ( ship ) => {
    //   return new Ship(
    //     canvasConfig,
    //     Object.assign(
    //       {},
    //       configs[ ship.type ],
    //       ship
    //     )
    //   );
    // });

    this.gameClock = Game.Clock( missionData.timeLeft );
    this.gameClock.start();
    // add actions to keyboard events
    KeyboardControls.bind( this.gameClock, this.getKeyboardActions() );

    this.gameClock.addAction( ( delta ) => {
      this.updateGame( delta );
    });

    this.timerId = setInterval( () => {
      this.mission.actors.push(new Ship(
        canvasConfig,
        Object.assign(
          {},
          configs.alienClass1,
          {
            x: Math.floor(Math.random() * 4000 - 2000),
            y: Math.floor(Math.random() * 4000 - 2000),
            speed: Math.floor(Math.random() * 200),
            direction: Math.floor(Math.random() * 360)
          }
        )
      ));
    }, 5000);
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

    const missionKey = this.props.location.query.key;
    if ( missionKey ) {
      this.loadMission( missionKey );
    }
  }

  renderPauseScreen () {
    if ( this.gameClock && !this.gameClock.isRunning ) {
      return (
        <div className={ styles.Pause }>
          <h2>Mission paused</h2>
          <input ref="inputSaveMission" type="text" />
          <button onClick={ this.onSaveClicked.bind(this) }>Save mission</button>
        </div>
      );
    }

    return null;
  }

  render () {

    return (
      <div className={ styles.Mission }>
        { this.renderPauseScreen() }
        <GameComponent
          hero={ this.state.hero }
          actors={ this.state.actors }
          shots={ this.state.shots }
          stats={ this.state.stats }
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
