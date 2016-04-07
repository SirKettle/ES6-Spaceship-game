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
    playerShip: React.PropTypes.object,
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
      canvasUtils.drawThing( ctx, actor, getXPositionOffset( actor, playerShip ), getYPositionOffset( actor, playerShip ), showGuides );
    });

    // Draw our moving grid line guides
    if ( showGuides ) {
      canvasUtils.drawMovingGrid( canvas, ctx, playerShip );
    }

    // Draw our player spaceship
    canvasUtils.drawThing( ctx, playerShip, getXPositionOffset( playerShip, playerShip ), getYPositionOffset( playerShip, playerShip ), showGuides );

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
    const { score, playerShip, shots } = this.props;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText( parseInt(playerShip.x) + ' by ' + parseInt(playerShip.y) + ' - px/s: ' + parseInt(playerShip.speed) + ' - SHOTS: ' + shots.length, 40, 43);
  }

  componentDidMount() {
    this.canvases = {
      game: this.refs.gameCanvas,
      map: this.refs.mapCanvas,
      scenery: this.refs.sceneryCanvas
    };

    Object.keys( this.canvases ).forEach( ( canvasKey ) => {
      const canvasElem = this.canvases[ canvasKey ];
      this.contexts[ canvasKey ] = canvasElem.getContext('2d');
    });

    this.renderScene();
  }

  renderScene ( canvases ) {
    this.renderGameCanvas( this.contexts.game );
    this.renderMapCanvas( this.contexts.map );
    this.renderSceneryCanvas( this.contexts.scenery );
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

        <canvas ref="sceneryCanvas"
          className={ styles.CanvasScenery }
          width={ map.width }
          height={ map.height }
        />
      </div>
    );
  }
}
