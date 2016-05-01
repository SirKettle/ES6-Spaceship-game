import styles from './_Game.scss';
import React from 'react';
import classNames from 'classNames';
import canvasUtils from '../../util/canvas';
import gameUtils from '../../util/game';
import screenUtils from '../../util/screen';

// TODO: can we use import here instead?
require('file?!../../assets/space_bg.jpg');

export default class GameComponent extends React.Component {

  static propTypes = {
    canvas: React.PropTypes.shape({
      width: React.PropTypes.number,
      height: React.PropTypes.number
    }).isRequired,
    map: React.PropTypes.shape({
      width: React.PropTypes.number,
      height: React.PropTypes.number,
      direction: React.PropTypes.number,
      ships: React.PropTypes.arrayOf(React.PropTypes.object)
    }).isRequired,
    playerShip: React.PropTypes.object,
    actors: React.PropTypes.arrayOf(React.PropTypes.object),
    shots: React.PropTypes.arrayOf(React.PropTypes.object),
    score: React.PropTypes.object,
    showGuides: React.PropTypes.bool,
    showMap: React.PropTypes.bool,
    onCanvasClicked: React.PropTypes.func
  }

  contexts = {}

  canvases = {}

  parallaxCoords = []

  renderParallax = ( ctx, factor = 1, coords = [], opacity = 1 ) => {
    const { canvas, playerShip } = this.props;

    const updateCoord = ( current, change = 0, max ) => {
      let newCoord = current - (change % max);

      if ( newCoord < 0 ) {
        newCoord = max + newCoord;
      }

      return newCoord % max;
    }

    const moveBy = {
      x: (playerShip.x || 0) * factor,
      y: (playerShip.y || 0) * factor
    };

    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    coords = coords.map( ( point ) => {
      const newPoint = {
        x: updateCoord( point.x, moveBy.x, canvas.width),
        y: updateCoord( point.y, moveBy.y, canvas.height)
      };
      canvasUtils.drawCircle(canvas, ctx, newPoint.x, newPoint.y, 1, `rgba( 255, 255, 255, ${ opacity } )`);
      return newPoint;
    });
  }

  renderGameCanvas = ( ctx ) => {
    const { canvas, map, playerShip, actors, shots, showGuides, showMap } = this.props;

    const getXPositionOffset = ( thing, offsetThing ) => {
      return gameUtils.getXPositionOffset( thing, offsetThing, canvas );
    };

    const getYPositionOffset = ( thing, offsetThing ) => {
      return gameUtils.getYPositionOffset( thing, offsetThing, canvas );
    };

    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if ( !playerShip._ready ) { return };

    // TODO: ONLY DRAW THINGS WHICH ARE VISIBLE IN THE CANVAS FRAME

    // Draw the shots
    shots.forEach( ( shot ) => {
      canvasUtils.drawShot( canvas, ctx, getXPositionOffset( shot, playerShip ), getYPositionOffset( shot, playerShip ), shot.direction, shot.size, shot.health );
    });

    // Draw the other actors (ie enemy ships, space stations etc)
    actors.forEach( ( actor ) => {
      canvasUtils.drawThing( canvas, ctx, actor, getXPositionOffset( actor, playerShip ), getYPositionOffset( actor, playerShip ), showGuides );
    });

    // Draw our moving grid line guides
    if ( showGuides ) {
      canvasUtils.drawMovingGrid( canvas, ctx, playerShip );
    }

    // Draw our player spaceship
    canvasUtils.drawThing( canvas, ctx, playerShip, getXPositionOffset( playerShip, playerShip ), getYPositionOffset( playerShip, playerShip ), showGuides );
  }

  renderMapCanvas = ( ctx ) => {
    const { map, showMap } = this.props;

    if ( !map || !map.width ) {
      return;
    }

    // clear the canvas
    ctx.clearRect(0, 0, map.width, map.height);

    if ( showMap ) {
      canvasUtils.drawMap( map, ctx );
    }
  }

  renderSceneryCanvas = ( ctx ) => {
    // this is where we will give the impression of motion
    // without needing the guides
    // ie,
    // 1st layer - dust clouds, junk etc - moving at same speed
    // 2nd layer - middle distance - moons, planets, stars etc - moving at 1/3 speed
  }

  componentDidMount () {
    const { canvas } = this.props;

    this.canvases = {
      game: this.refs.gameCanvas,
      map: this.refs.mapCanvas,
      parallaxForeground: this.refs.parallaxForegroundCanvas,
      parallaxBackground: this.refs.parallaxBackgroundCanvas,
      scenery: this.refs.sceneryCanvas
    };

    Object.keys( this.canvases ).forEach( ( canvasKey ) => {
      const canvasElem = this.canvases[ canvasKey ];
      this.contexts[ canvasKey ] = canvasElem.getContext('2d');
    });

    this.parallaxCoords.push( gameUtils.randomCoords( 20, canvas.width, canvas.height ) );
    this.parallaxCoords.push( gameUtils.randomCoords( 40, canvas.width, canvas.height ) );

    this.renderScene();
  }

  renderScene ( canvases ) {
    this.renderSceneryCanvas( this.contexts.scenery );
    // could add many levels of this
    this.renderGameCanvas( this.contexts.game );
    this.renderMapCanvas( this.contexts.map );
    if ( screenUtils.isTouch ) { return; }
    this.renderParallax( this.contexts.parallaxForeground, 0.5, this.parallaxCoords[0], 0.9 );
    this.renderParallax( this.contexts.parallaxBackground, 0.1, this.parallaxCoords[1], 0.6 );
  }

  componentDidUpdate() {
    this.renderScene();
  }

  getBackgroundPosition ( factor = 0.2 ) {
    const { playerShip } = this.props;

    return `${ -playerShip.x * factor }px ${ -playerShip.y * factor }px`;
  }

  render() {

    const { canvas, map, onCanvasClicked } = this.props;
    const inlineStyles = {
      backgroundImage: 'url(../../assets/space_bg.jpg)',
      width: canvas.width,
      height: canvas.height
      // ,backgroundPosition: this.getBackgroundPosition()
    };

    const classes = classNames(
      styles.Game,
      {
        [ styles.Mobile ]: screenUtils.isTouch
      }
    )

    return (
      <div className={ classes }
        style={ inlineStyles }
      >

        <canvas ref="mapCanvas"
          className={ styles.CanvasMap }
          width={ map.width }
          height={ map.height }
        />

        <canvas ref="gameCanvas"
          className={ styles.CanvasGame }
          width={ canvas.width }
          height={ canvas.height }
          onClick={ onCanvasClicked }
        />

        <canvas ref="parallaxForegroundCanvas"
          className={ styles.CanvasParallax }
          width={ canvas.width }
          height={ canvas.height }
        />

        <canvas ref="parallaxBackgroundCanvas"
          className={ styles.CanvasParallax }
          width={ canvas.width }
          height={ canvas.height }
        />

        <canvas ref="sceneryCanvas"
          className={ styles.CanvasScenery }
          width={ canvas.width }
          height={ canvas.height }
        />
      </div>
    );
  }
}
