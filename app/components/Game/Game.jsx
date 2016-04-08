import styles from './_Game.scss';
import React from 'react';
import canvasUtils from '../../util/canvas';
import gameUtils from '../../util/game';

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
    hero: React.PropTypes.object,
    actors: React.PropTypes.arrayOf(React.PropTypes.object),
    shots: React.PropTypes.arrayOf(React.PropTypes.object),
    stats: React.PropTypes.arrayOf(React.PropTypes.object),
    score: React.PropTypes.object,
    showGuides: React.PropTypes.bool,
    showMap: React.PropTypes.bool,
    onCanvasClicked: React.PropTypes.func
  }

  contexts = {}

  canvases = {}

  parallaxCoords = []

  renderParallax = ( ctx, factor = 1, coords = [] ) => {
    const { canvas, playerShip } = this.props;

    const updateCoord = ( current, change, max ) => {
      const newCoord = current - change;

      if ( newCoord < 0 ) {
        return max + newCoord;
      }

      return newCoord;
    }

    const moveBy = {
      x: playerShip.x * factor,
      y: playerShip.y * factor
    };

    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    coords = coords.map( ( point ) => {
      point = {
        x: updateCoord( point.x, moveBy.x, canvas.width),
        y: updateCoord( point.y, moveBy.y, canvas.height)
      };
      canvasUtils.drawCircle(ctx, point.x, point.y, 1, 'rgba( 255, 255, 255, 0.3 )');
      return point;
    });

    return coords;
  }

  renderGameCanvas = ( ctx ) => {
    const { canvas, map, hero, actors, shots, showGuides, showMap } = this.props;

    const getXPositionOffset = ( thing, offsetThing ) => {
      return gameUtils.getXPositionOffset( thing, offsetThing, canvas );
    };

    const getYPositionOffset = ( thing, offsetThing ) => {
      return gameUtils.getYPositionOffset( thing, offsetThing, canvas );
    };

    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if ( !hero._ready ) { return };

    // TODO: ONLY DRAW THINGS WHICH ARE VISIBLE IN THE CANVAS FRAME

    // Draw the shots
    shots.forEach( ( shot ) => {
      canvasUtils.drawShot( canvas, ctx, getXPositionOffset( shot, hero ), getYPositionOffset( shot, hero ), shot.direction, shot.size, shot.health );
    });

    // Draw the other actors (ie enemy ships, space stations etc)
    actors.forEach( ( actor ) => {
      canvasUtils.drawThing( ctx, actor, getXPositionOffset( actor, hero ), getYPositionOffset( actor, hero ), showGuides );
    });

    // Draw our moving grid line guides
    if ( showGuides ) {
      canvasUtils.drawMovingGrid( canvas, ctx, hero );
    }

    // Draw our player spaceship
    canvasUtils.drawThing( ctx, hero, getXPositionOffset( hero, hero ), getYPositionOffset( hero, hero ), showGuides );

    // TODO: replace this with a simple div for performance
    this.paintScore( ctx );
  }

  renderMapCanvas = ( ctx ) => {
    const { map, showMap } = this.props;

    // clear the canvas
    ctx.clearRect(0, 0, map.width, map.height);

    if ( showMap ) {
      canvasUtils.drawMap( ctx, map );
    }
  }

  renderSceneryCanvas = ( ctx) => {
    // this is where we will give the impression of motion
    // without needing the guides
    // ie,
    // 1st layer - dust clouds, junk etc - moving at same speed
    // 2nd layer - middle distance - moons, planets, stars etc - moving at 1/3 speed
  }

  paintScore ( ctx ) {
    const { score, hero, shots } = this.props;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText( parseInt(hero.x) + ' by ' + parseInt(hero.y) + ' - px/s: ' + parseInt(hero.speed) + ' - SHOTS: ' + shots.length, 40, 43);
  }

  componentDidMount() {
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

    this.parallaxCoords.push( gameUtils.randomCoords( 100, canvas.width, canvas.height ) );
    this.parallaxCoords.push( gameUtils.randomCoords( 200, canvas.width, canvas.height ) );

    this.renderScene();
  }

  renderScene ( canvases ) {
    this.renderGameCanvas( this.contexts.game );
    this.renderMapCanvas( this.contexts.map );
    this.renderSceneryCanvas( this.contexts.scenery );
    // could add many levels of this
    this.parallaxCoords[0] = this.renderParallax( this.contexts.parallaxForeground, 0.75, this.parallaxCoords[0] );
    this.parallaxCoords[0] = this.renderParallax( this.contexts.parallaxBackground, 0.25, this.parallaxCoords[0] );
  }

  componentDidUpdate() {
    this.renderScene();
  }

  renderStats() {
    return this.props.stats.map( ( stat ) => {
      return (
        <tr key={ stat.label }><th>{ stat.label }</th><td>{ stat.value }</td></tr>
      );
    });
  }

  render() {

    const { canvas, map, onCanvasClicked } = this.props;
    const inlineStyles = {
      backgroundImage: 'url(../../assets/space_bg.jpg)',
      width: canvas.width,
      height: canvas.height
    };

    return (
      <div className={ styles.Game }
        style={ inlineStyles }
      >
        <table className={ styles.Stats }>
          <tbody>
            { this.renderStats() }
          </tbody>
        </table>

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
          width={ map.width }
          height={ map.height }
        />

        <canvas ref="parallaxBackgroundCanvas"
          className={ styles.CanvasParallax }
          width={ map.width }
          height={ map.height }
        />

        <canvas ref="sceneryCanvas"
          className={ styles.CanvasScenery }
          width={ map.width }
          height={ map.height }
        />
      </div>
    );
  }
}
