
import gameUtils from '../util/game';


const imageShip = document.createElement('img');
imageShip.onload = () => {
    console.log('imageShip loaded');
};
imageShip.src = 'http://image.xboxlive.com/global/t.535507d4/tile/0/28007';
// imageShip.src = '/assets/heartship.png';

const canvasUtils = {

  drawTriangle: ( ctx, x, y, width, color, direction ) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x - width, y);
    ctx.lineTo(x, direction === 'up' ? y - width : y + width);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x - width,y);
    ctx.fill();
  },

  drawShip: ( canvas, ctx, x, y, direction ) => {
    const radians = gameUtils.degreesToRadians( direction );
    ctx.save();
    ctx.translate( x, y );
    ctx.translate( imageShip.width * 0.5, imageShip.height * 0.5 );
    ctx.rotate( radians );
    ctx.drawImage( imageShip, -imageShip.width * 0.5, -imageShip.width * 0.5 );
    ctx.restore();
  }

}

export default canvasUtils;