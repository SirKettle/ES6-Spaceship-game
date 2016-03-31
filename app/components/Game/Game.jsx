import styles from './_Game.scss';
import React from 'react';
import canvasUtils from '../../util/canvas';

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
    ctx.fillStyle = '#44ddff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // console.log(gameState);

    // canvasUtils.drawGrid( canvas, ctx );

    const heroOffSet = {
      x: hero.x + canvas.width * 0.5,
      y: hero.y + canvas.height * 0.5
    }

    shots.forEach( ( shot ) => {
      canvasUtils.drawShot( canvas, ctx, shot.x - heroOffSet.x, shot.y - heroOffSet.y, shot.direction, shot.size, shot.color );
    });

    enemies.forEach( ( enemy ) => {
      canvasUtils.drawAlien( canvas, ctx, enemy.x, enemy.y, enemy.direction );
    });
    // canvasUtils.drawTriangle( ctx, hero.x, hero.y, 20, '#f2f2f2', hero.direction );
    // canvasUtils.drawShip( canvas, ctx, hero.x, hero.y, hero.direction );

    // canvasUtils.drawDaddyShip( canvas, ctx, hero.x - 100, hero.y + 100, hero.direction, hero.animation );
    canvasUtils.drawDaddyShip( canvas, ctx, canvas.width * 0.5, canvas.height * 0.5, hero.direction, hero.animation );
    // temp alien
    // canvasUtils.drawAlien( canvas, ctx, hero.x + 200, hero.y + 200, hero.direction );
    // canvasUtils.drawAlien( canvas, ctx, hero.x - 200, hero.y - 200, hero.direction );
    // canvasUtils.drawAlien( canvas, ctx, hero.x + 200, hero.y - 200, hero.direction );
    // canvasUtils.drawAlien( canvas, ctx, hero.x - 200, hero.y + 200, hero.direction );

    canvasUtils.drawMovingGrid( canvas, ctx, hero );

    // ctx.translate( hero.x, hero.y );

    this.paintScore( ctx );


  }

  paintScore ( ctx ) {
    const { gameState, hero, shots } = this.props;
    const score = gameState.score.score;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText( parseInt(hero.x) + ' by ' + parseInt(hero.y) + ' - px/s: ' + hero.speed + ' - SHOTS: ' + shots.length, 40, 43);
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
      <div className={styles.Game}>
        <canvas ref="gameCanvas"
          width={ canvas.width }
          height={ canvas.height }
          onClick={ onCanvasClicked }
        />
      </div>
    );
  }
}
