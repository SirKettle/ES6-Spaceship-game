import styles from './_Game.scss';
import React from 'react';
import canvasUtils from '../../util/canvas';

require("file?!../../assets/space_bg.jpg");

export default class GameComponent extends React.Component {

  static propTypes = {
    hero: React.PropTypes.object,
    enemies: React.PropTypes.arrayOf(React.PropTypes.object),
    shots: React.PropTypes.arrayOf(React.PropTypes.object),
    gameState: React.PropTypes.shape({
      running: React.PropTypes.bool,
      score: React.PropTypes.object,
      hero: React.PropTypes.object,
      data: React.PropTypes.object
    }).isRequired,
    canvas: React.PropTypes.shape({
      width: React.PropTypes.number,
      height: React.PropTypes.number
    }).isRequired,
    onCanvasClicked: React.PropTypes.func
  }

  renderScene( ctx, canvas ) {
    const { hero, enemies, shots } = this.props;

    const getXPositionOffset = ( thing, offsetThing ) => {
      const canvasCenter = canvas.width * 0.5 - offsetThing.size * 0.5;
      return thing.x - offsetThing.x + canvasCenter;
    };

    const getYPositionOffset = ( thing, offsetThing ) => {
      const canvasCenter = canvas.height * 0.5;
      return thing.y - offsetThing.y + canvasCenter - offsetThing.size * 0.5;
    };

    if ( !hero._ready ) { return };

    ctx.fillStyle = '#00162f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // console.log(gameState);

    // canvasUtils.drawGrid( canvas, ctx );

    shots.forEach( ( shot ) => {
      canvasUtils.drawShot( canvas, ctx, getXPositionOffset( shot, hero ), getYPositionOffset( shot, hero ), shot.direction, shot.size, shot.health );
    });

    enemies.forEach( ( enemy ) => {
      canvasUtils.drawAlien( canvas, ctx, getXPositionOffset( enemy, hero ), getYPositionOffset( enemy, hero ), enemy.direction );
      canvasUtils.drawHoop( ctx, getXPositionOffset( enemy.circle, hero ), getYPositionOffset( enemy.circle, hero ), enemy.circle.radius, '#ff0000' );
    });
    // canvasUtils.drawTriangle( ctx, hero.x, hero.y, 20, '#f2f2f2', hero.direction );
    // canvasUtils.drawShip( canvas, ctx, hero.x, hero.y, hero.direction );
    canvasUtils.drawMovingGrid( canvas, ctx, hero );

    // canvasUtils.drawDaddyShip( canvas, ctx, hero.x - 100, hero.y + 100, hero.direction, hero.animation );
    // canvasUtils.drawDaddyShip( canvas, ctx, getXPositionOffset( hero, hero ), getYPositionOffset( hero, hero ), hero.direction, hero.image );
    // canvasUtils.drawHoop( ctx, getXPositionOffset( hero.circle, hero ), getYPositionOffset( hero.circle, hero ), hero.circle.radius, 'rgba( 0, 255, 130, 0.5 )' );

    canvasUtils.drawThing( ctx, hero, getXPositionOffset( hero, hero ), getYPositionOffset( hero, hero ) );
    // temp alien
    // canvasUtils.drawAlien( canvas, ctx, hero.x + 200, hero.y + 200, hero.direction );
    // canvasUtils.drawAlien( canvas, ctx, hero.x - 200, hero.y - 200, hero.direction );
    // canvasUtils.drawAlien( canvas, ctx, hero.x + 200, hero.y - 200, hero.direction );
    // canvasUtils.drawAlien( canvas, ctx, hero.x - 200, hero.y + 200, hero.direction );


    // ctx.translate( hero.x, hero.y );

    this.paintScore( ctx );


  }

  paintScore ( ctx ) {
    const { gameState, hero, shots } = this.props;
    const score = gameState.score.score;
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

    return (
      <div className={styles.Game}
        style={
          {
            backgroundImage: 'url(../../assets/space_bg.jpg)'
          }
        }
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
