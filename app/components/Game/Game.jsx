import styles from './_Game.scss';
import React from 'react';
import canvasUtils from '../../util/canvas';

export default class Game extends React.Component {

  static propTypes = {
    gameState: React.PropTypes.shape({
      running: React.PropTypes.bool,
      score: React.PropTypes.object,
      data: React.PropTypes.object
    }).isRequired,
    canvas: React.PropTypes.shape({
      width: React.PropTypes.number,
      height: React.PropTypes.number
    }).isRequired,
    onCanvasClicked: React.PropTypes.func
  }

  renderScene( ctx, canvas ) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    canvasUtils.drawTriangle( ctx, 200, 300, 20, '#aa0000', 'up' );

    this.paintScore( ctx );
  }

  paintScore ( ctx ) {
    const { gameState } = this.props;
    const score = gameState.score.score;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('Score: ' + score, 40, 43);
  }

  getCanvasWidth() {
    return 900;
  }

  getCanvasHeight() {
    return 800;
  }

  componentDidMount() {
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
