
const gameUtils = {

  rollDice: ( possValues = 6 ) => {
    return gameUtils.getRandomInt( 1, possValues );
  },

  getRandomInt: ( min, max ) => {
    return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
  },

  degreesToRadians: ( degrees ) => {
    return degrees * ( Math.PI / 180 );
  },

  radiansToDegrees: ( radians ) => {
    return radians * ( 180 / Math.PI );
  },

  getXPositionOffset: ( thing, offsetThing, canvas ) => {
    const canvasCenter = canvas.width * 0.5;
    return thing.x - offsetThing.x + canvasCenter - offsetThing.size * 0.5;
  },

  getYPositionOffset: ( thing, offsetThing, canvas ) => {
    const canvasCenter = canvas.height * 0.5;
    return thing.y - offsetThing.y + canvasCenter - offsetThing.size * 0.5;
  }
}

export default gameUtils;
