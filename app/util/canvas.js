
import gameUtils from '../util/game';


const canvasUtils = {

  drawTriangle: ( ctx, x, y, width, color, direction ) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x - width, y);
    ctx.lineTo(x, direction === 'up' ? y - width : y + width);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x - width,y);
    ctx.fill();



    // ctx.fillStyle = color;
    // ctx.beginPath();
    // ctx.moveTo(x - width, y - distanceY);
    // ctx.lineTo(x + width + distanceX, y);
    // ctx.lineTo(x + width, y + width);
    // ctx.lineTo(x + width, y + width);


    const distanceX = Math.sin( radians ) * width;
    const distanceY = Math.cos( radians ) * width;
  }

}

export default canvasUtils;


// var canvas=document.getElementById("canvas");
// var ctx=canvas.getContext("2d");

// var angleInDegrees=0;

// var image=document.createElement("img");
// image.onload=function(){
//     ctx.drawImage(image,canvas.width/2-image.width/2,canvas.height/2-image.width/2);
// }
// image.src="https://www.google.co.uk/logos/doodles/2016/william-morris-182nd-birthday-6264940497207296-5665117697998848-ror.jpg";

// $("#clockwise").click(function(){
//     angleInDegrees+=45;
//     drawRotated(angleInDegrees);
// });

// $("#counterclockwise").click(function(){
//     angleInDegrees-=45;
//     drawRotated(angleInDegrees);
// });

// function drawRotated(degrees){
//     ctx.clearRect(0,0,canvas.width,canvas.height);
//     ctx.save();
//     ctx.translate(canvas.width/2,canvas.height/2);
//     ctx.rotate(degrees*Math.PI/180);
//     ctx.drawImage(image,-image.width/2,-image.width/2);
//     ctx.restore();
// }


