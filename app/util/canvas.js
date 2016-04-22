
import gameUtils from './game';

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
    const shipColor = 'rgba( 250, 100, 100, 1)';
    const friendlyColor = 'rgba( 250, 200, 100, 1)';

    canvasUtils.drawCircle( ctx, map.width * 0.5, map.height * 0.5, 2, '#ffffff' );

    (map.ships || []).forEach( ( ship ) => {
        const color = ship.isFriendly ? friendlyColor : shipColor;
        // canvasUtils.drawCircle( ctx, ship.x, ship.y, 2, color );
        canvasUtils.drawRect( ctx, ship.x, ship.y, 4, color );
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

  drawRect: ( ctx, x, y, size, color = '#000000' ) => {
    //draw a circle
    ctx.fillStyle = color;
    ctx.fillRect( x, y, size, size );
  },

  drawCircle: ( ctx, x, y, size, color = '#000000' ) => {
    //draw a circle
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc( x, y, size, 0, Math.PI * 2, true );
    ctx.closePath();
    ctx.fill();
  },

  drawHoop: ( ctx, x, y, size, color = '#000000', strokeSize = 1 ) => {
    //draw a circle
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc( x, y, size, 0, Math.PI * 2, true );
    ctx.closePath();
    ctx.lineWidth = strokeSize;
    ctx.stroke();
  },

  drawThing: ( ctx, thing, x, y, showGuides = true ) => {
    const { image, circle, direction, targetDirection } = thing;
    if ( !image ) {
      console.warn( 'image not found', thing );
      return;
    }
    const guidesColor = 'rgba( 0, 255, 130, 0.5 )';
    const crosshairOffset = 25;
    const radians = gameUtils.degreesToRadians( direction );
    ctx.save();
    ctx.translate( x, y );
    ctx.translate( image.width * 0.5, image.height * 0.5 );
    ctx.rotate( radians );
    ctx.drawImage( image, -image.width * 0.5, -image.width * 0.5 );
    ctx.restore();

    const center = {
        x: x + thing.size * 0.5,
        y: y + thing.size * 0.5
    };

    // draw the health status
    let healthColor = guidesColor;
    if ( thing.health < 1 ) { healthColor = '#ddaa00'; }
    if ( thing.health < 0.5 ) { healthColor = '#ff0000'; }
    canvasUtils.drawHoop( ctx, center.x, center.y, circle.radius - 5, healthColor, 3);

    if ( showGuides ) {
        // todo - make the cross hairs bigger than the circle
        canvasUtils.drawHoop( ctx, center.x, center.y, circle.radius, guidesColor);
        ctx.strokeStyle = guidesColor;
        ctx.beginPath();
        ctx.moveTo( center.x, y - crosshairOffset);
        ctx.lineTo( center.x, y + thing.size + crosshairOffset);
        ctx.moveTo( x - crosshairOffset, center.y);
        ctx.lineTo( x + thing.size + crosshairOffset, center.y);
        ctx.stroke();
        ctx.closePath();

        if ( typeof targetDirection === 'number' ) {
            const xTo = gameUtils.getXPositionFromAngle( center.x, targetDirection, circle.radius + 30 );
            const yTo = gameUtils.getYPositionFromAngle( center.y, targetDirection, circle.radius + 30 );
            ctx.strokeStyle = '#ddaa00';
            ctx.beginPath();
            ctx.moveTo( center.x, center.y );
            ctx.lineTo( xTo, yTo );
            ctx.stroke();
            ctx.closePath();
        }
    }
  }

}

export default canvasUtils;
