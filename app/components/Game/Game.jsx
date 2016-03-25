import styles from './_Game.scss';
import React from 'react';
import canvasUtils from '../../util/canvas';

export default class GameComponent extends React.Component {

  static propTypes = {
    hero: React.PropTypes.object,
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
    const { hero } = this.props;
    ctx.fillStyle = '#44ddff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // console.log(gameState);

    // canvasUtils.drawTriangle( ctx, hero.x, hero.y, 20, '#f2f2f2', hero.direction );
    canvasUtils.drawShip( canvas, ctx, hero.x, hero.y, hero.direction );

    this.paintScore( ctx );
  }

  paintScore ( ctx ) {
    const { gameState, hero } = this.props;
    const score = gameState.score.score;
    ctx.fillStyle = '#cccccc';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('s: ' + hero.speed, 40, 43);
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
