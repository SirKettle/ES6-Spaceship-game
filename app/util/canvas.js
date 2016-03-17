
const canvasUtils = {

  drawTriangle: ( ctx, x, y, width, color, direction ) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x - width, y);
    ctx.lineTo(x, direction === 'up' ? y - width : y + width);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x - width,y);
    ctx.fill();
  }

}

export default canvasUtils;
