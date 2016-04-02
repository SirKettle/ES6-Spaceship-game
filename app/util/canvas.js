
import gameUtils from '../util/game';

const canvasUtils = {

  drawMovingGrid ( canvas, ctx, hero ) {
    const { x, y } = hero;
    const distance = 150;
    const offsetX = x % distance;
    const offsetY = y % distance;

    canvasUtils.drawGrid( canvas, ctx, -offsetX, -offsetY, distance, distance, 'rgba( 0, 255, 130, 0.5 )', 'rgba( 0, 255, 130, 0.5 )' );
  },

  drawGrid: ( canvas, ctx, posX = 0, posY = 0, distance = 50, highlightDistance = 100, color = '#888888', highlightColor = '#000000' ) => {
    ctx.beginPath();
    let position = posX;

    while ( position < canvas.width ) {
        ctx.strokeStyle = position % highlightDistance === 0 ? highlightColor : color;
        ctx.moveTo( position, 0 );
        ctx.lineTo( position, canvas.height );
        position += distance;
    }

    position = posY;

    while ( position < canvas.height ) {
        ctx.strokeStyle = position % highlightDistance === 0 ? highlightColor : color;
        ctx.moveTo( 0, position );
        ctx.lineTo( canvas.width, position );
        position += distance;
    }

    ctx.stroke();
    ctx.closePath();
  },

  drawMap: ( ctx, map ) => {
    const shipColor = 'rgba( 250, 100, 100, 0.5)';
    ctx.strokeStyle = 'rgba( 250, 200, 100, 1)';
    ctx.strokeRect( 0, 0, map.width, map.height);

    (map.ships || []).forEach( ( ship ) => {
        canvasUtils.drawCircle( ctx, ship.x, ship.y, 3, shipColor );
    });
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


  drawShot: ( canvas, ctx, x, y, direction, size = 10, opacity = 1 ) => {
    const color = `rgba( 0, 255, 0, ${opacity}`;
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

  drawHoop: ( ctx, x, y, size, color = '#000000' ) => {
    //draw a circle
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc( x, y, size, 0, Math.PI * 2, true );
    ctx.closePath();
    ctx.stroke();
  },

  drawThing: ( ctx, thing, x, y, showGuides = true ) => {
    const { image, circle, direction } = thing;
    const guidesColor = 'rgba( 0, 255, 130, 0.5 )';
    const crosshairOffset = 25;
    const radians = gameUtils.degreesToRadians( direction );
    ctx.save();
    ctx.translate( x, y );
    ctx.translate( image.width * 0.5, image.height * 0.5 );
    ctx.rotate( radians );
    ctx.drawImage( image, -image.width * 0.5, -image.width * 0.5 );
    ctx.restore();

    if ( showGuides ) {
        // todo - make the cross hairs bigger than the circle
        canvasUtils.drawHoop( ctx, x + thing.size * 0.5, y + thing.size * 0.5, circle.radius, guidesColor);
        ctx.strokeStyle = guidesColor;
        ctx.beginPath();
        ctx.moveTo( x + thing.size * 0.5, y - crosshairOffset);
        ctx.lineTo( x + thing.size * 0.5, y + thing.size + crosshairOffset);
        ctx.moveTo( x - crosshairOffset, y + thing.size * 0.5);
        ctx.lineTo( x + thing.size + crosshairOffset, y + thing.size * 0.5);
        ctx.stroke();
        ctx.closePath();
    }
  }

}

export default canvasUtils;
