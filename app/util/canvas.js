
import gameUtils from '../util/game';

// import images
require("file?!../assets/alien_ship_100.png");
require("file?!../assets/harrison_ship_100.png");
require("file?!../assets/will_ship_sp0.png");
require("file?!../assets/will_ship_sp1.png");
require("file?!../assets/will_ship_sp2.png");
require("file?!../assets/will_ship_sp3.png");
require("file?!../assets/will_ship_sp4.png");
require("file?!../assets/will_ship_sp5.png");


const imageShip = document.createElement('img');
imageShip.onload = () => {
    console.log('imageShip loaded');
};
imageShip.src = '/assets/harrison_ship_100.png';

const imageAlien = document.createElement('img');
imageAlien.onload = () => {
    console.log('imageAlien loaded');
};
imageAlien.src = '/assets/alien_ship_100.png';

const daddyShips = [];
daddyShips.push(document.createElement('img'));
daddyShips.push(document.createElement('img'));
daddyShips.push(document.createElement('img'));
daddyShips.push(document.createElement('img'));
daddyShips.push(document.createElement('img'));
daddyShips.push(document.createElement('img'));

daddyShips.forEach( ( ds, index ) => {
    ds.src = `/assets/will_ship_sp${ index }.png`;
});

const canvasUtils = {

  drawMovingGrid ( canvas, ctx, hero ) {
    const { x, y } = hero;

    const offsetX = x % 100;
    const offsetY = y % 100;

    canvasUtils.drawGrid( canvas, ctx, -offsetX, -offsetY, 100, 200, '#00ff88');

  },
  
  drawGrid: ( canvas, ctx, posX = 0, posY = 0, distance = 50, highlightDistance = 100, color = '#888888', highlightColor = '#000000' ) => {

    let position = posX;
    
    while ( position < canvas.width ) {
        ctx.strokeStyle = position % highlightDistance === 0 ? highlightColor : color;
        ctx.beginPath();
        ctx.moveTo( position, 0 );
        ctx.lineTo( position, canvas.height );
        ctx.stroke();
        ctx.closePath();
        position += distance;
    }

    position = posY;
    
    while ( position < canvas.height ) {
        ctx.strokeStyle = position % highlightDistance === 0 ? highlightColor : color;
        ctx.beginPath();
        ctx.moveTo( 0, position );
        ctx.lineTo( canvas.width, position );
        ctx.stroke();
        ctx.closePath();
        position += distance;
    }
  },

  drawTriangle: ( ctx, x, y, width, color, direction ) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x - width, y);
    ctx.lineTo(x, direction === 'up' ? y - width : y + width);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x - width, y);
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

    canvasUtils.drawCrossHairs( canvas, ctx, x, y );
  },

  drawAlien: ( canvas, ctx, x, y, direction ) => {
    const radians = gameUtils.degreesToRadians( direction );
    ctx.save();
    ctx.translate( x, y );
    ctx.translate( imageAlien.width * 0.5, imageAlien.height * 0.5 );
    ctx.rotate( radians );
    ctx.drawImage( imageAlien, -imageAlien.width * 0.5, -imageAlien.width * 0.5 );
    ctx.restore();

    canvasUtils.drawCrossHairs( canvas, ctx, x, y );
  },

  drawDaddyShip: ( canvas, ctx, x, y, direction, index = 0 ) => {
    const radians = gameUtils.degreesToRadians( direction );
    const imageDaddyShip = daddyShips[ index ];
    ctx.save();
    ctx.translate( x, y );
    ctx.translate( imageDaddyShip.width * 0.5, imageDaddyShip.height * 0.5 );
    ctx.rotate( radians );
    ctx.drawImage( imageDaddyShip, -imageDaddyShip.width * 0.5, -imageDaddyShip.width * 0.5 );
    ctx.restore();

    canvasUtils.drawCrossHairs( canvas, ctx, x, y );
  },

  drawShot: ( canvas, ctx, x, y, direction, size = 10, color = '#00ff00' ) => {
    canvasUtils.drawCircle( ctx, x, y, size, color );
  },

  drawCircle: ( ctx, x, y, size, color = '#000000' ) => {
    //draw a circle
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc( x, y, size, 0, Math.PI * 2, true ); 
    ctx.closePath();
    ctx.fill();
  },

  drawCrossHairs: ( canvas, ctx, x, y, color = '#ff0' ) => {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo( x, y - 20);
    ctx.lineTo( x, y + 20);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo( x - 20, y);
    ctx.lineTo( x + 20, y);
    ctx.stroke();
    ctx.closePath();
  }

}

export default canvasUtils;