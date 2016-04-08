
const gameUtils = {

  randomCoords: ( numPoints, maxX, maxY ) => {
    const coords = [];
    let count = 0;
    while (count < numPoints) {
      coords.push({
        x: Math.floor( Math.random() * maxX ),
        y: Math.floor( Math.random() * maxY )
      })
      count++;
    }
    
    return coords;
  },

  doProbably: ( probability, doIt ) => {
    const oneIn = Math.floor( 1 / probability );
    if (gameUtils.rollDice(oneIn) === 1) {
      doIt();
      return true;
    }
    return false;
  },

  // ie if you need to generate an enemy ship, on average,
  // once per 20 seconds:
  // => gameUtils.doProbablyPerSeconds( delta, 20, generateShip );
  doProbablyPerSeconds: ( delta, seconds, doIt ) => {
    const probability = ( 1 / seconds ) * ( delta / 1000 );
    return gameUtils.doProbably( probability, doIt );
  },

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

  getDistance: ( circle1, circle2 ) => {
    const dx = Math.abs( circle1.x - circle2.x );
    const dy = Math.abs( circle1.y - circle2.y );
    return Math.sqrt( dx * dx + dy * dy );
  },

  handleCollision: ( thing1, thing2, delta ) => {
    const isCollision = gameUtils.getIsCollision( thing1.circle, thing2.circle );

    if ( isCollision ) {
      thing1.hit( thing2, delta );
      thing2.hit( thing1, delta );
    }
  },

  getIsCollision: ( circle1, circle2 ) => {
    const distance = gameUtils.getDistance( circle1, circle2 );
    return Boolean( distance < ( circle1.radius + circle2.radius ) );
  },

  getDirection: ( thing, target ) => {
    if ( !target ) { return; };
    const dx = thing.circle.x - target.circle.x;
    const dy = thing.circle.y - target.circle.y;
    const theta = Math.atan2(dy, dx);
    let newDirection = gameUtils.radiansToDegrees( theta ) - 90;

    if ( newDirection < 0 ) {
      newDirection = 360 + newDirection;
    }

    return newDirection % 360;
  },

  getXPositionFromAngle: ( xStart, angleDegrees, distance ) => {
    const radians = gameUtils.degreesToRadians( angleDegrees + 270 );
    return xStart + Math.cos( radians ) * distance;
  },

  getYPositionFromAngle: ( yStart, angleDegrees, distance ) => {
    const radians = gameUtils.degreesToRadians( angleDegrees + 270 );
    return yStart + Math.sin( radians ) * distance;
  }
}

export default gameUtils;
