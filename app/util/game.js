
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
  },

  handleCollision: ( thing1, thing2 ) => {
    const isCollision = gameUtils.getIsCollision( thing1.circle, thing2.circle );

    if ( isCollision ) {
      thing1.hit( thing2 );
      thing2.hit( thing1 );
    }
  },

  getIsCollision: ( circle1, circle2 ) => {
    const dx = Math.abs( circle1.x - circle2.x );
    const dy = Math.abs( circle1.y - circle2.y );
    const distance = Math.sqrt( dx * dx + dy * dy );
    return Boolean( distance < ( circle1.radius + circle2.radius ) );
  }
}

export default gameUtils;
