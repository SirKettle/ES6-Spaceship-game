import styles from './_Game.scss';
import React from 'react';
import canvasUtils from '../../util/canvas';

require("file?!../../assets/space_bg.jpg");

export default class GameComponent extends React.Component {

  static propTypes = {
    hero: React.PropTypes.object,
    enemies: React.PropTypes.arrayOf(React.PropTypes.object),
    shots: React.PropTypes.arrayOf(React.PropTypes.object),
    score: React.PropTypes.object,
    guides: React.PropTypes.bool,
    canvas: React.PropTypes.shape({
      width: React.PropTypes.number,
      height: React.PropTypes.number
    }).isRequired,
    onCanvasClicked: React.PropTypes.func
  }

  renderScene( ctx, canvas ) {
    const { hero, enemies, shots, guides } = this.props;

    const getXPositionOffset = ( thing, offsetThing ) => {
      const canvasCenter = canvas.width * 0.5 - offsetThing.size * 0.5;
      return thing.x - offsetThing.x + canvasCenter;
    };

    const getYPositionOffset = ( thing, offsetThing ) => {
      const canvasCenter = canvas.height * 0.5;
      return thing.y - offsetThing.y + canvasCenter - offsetThing.size * 0.5;
    };

    if ( !hero._ready ) { return };

    // return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // console.log(gameState);

    // canvasUtils.drawGrid( canvas, ctx );

    // Draw the shots
    shots.forEach( ( shot ) => {
      canvasUtils.drawShot( canvas, ctx, getXPositionOffset( shot, hero ), getYPositionOffset( shot, hero ), shot.direction, shot.size, shot.health );
    });

    // Draw the enemy ships
    enemies.forEach( ( enemy ) => {
      canvasUtils.drawThing( ctx, enemy, getXPositionOffset( enemy, hero ), getYPositionOffset( enemy, hero ), guides );
    });

    // Draw our moving grid line guides
    if ( guides ) {
      canvasUtils.drawMovingGrid( canvas, ctx, hero );
    }

    // Draw our player spaceship
    canvasUtils.drawThing( ctx, hero, getXPositionOffset( hero, hero ), getYPositionOffset( hero, hero ), guides );

    // TODO: replace this with a simple div for performance
    this.paintScore( ctx );
  }

  paintScore ( ctx ) {
    const { score, hero, shots } = this.props;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText( parseInt(hero.x) + ' by ' + parseInt(hero.y) + ' - px/s: ' + parseInt(hero.speed) + ' - SHOTS: ' + shots.length, 40, 43);


  }

  componentDidMount() {
    const { canvas, onCanvasClicked } = this.props;
    const canvasElem = this.refs.gameCanvas.getDOMNode();
    const ctx = canvasElem.getContext('2d');

    this.renderScene( ctx, canvas );
  }

  componentDidUpdate() {
    const { canvas, onCanvasClicked } = this.props;
    const canvasElem = this.refs.gameCanvas.getDOMNode();
    const ctx = canvasElem.getContext('2d');

    this.renderScene( ctx, canvas );
  }

  render() {

    const { canvas, onCanvasClicked } = this.props;
    const inlineStyles = {
      backgroundImage: 'url(../../assets/space_bg.jpg)'
    };

    return (
      <div className={ styles.Game }
        style={ inlineStyles }
      >
        <canvas ref="gameCanvas"
          width={ canvas.width }
          height={ canvas.height }
          onClick={ onCanvasClicked }
        />
      </div>
    );
  }
}
