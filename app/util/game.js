
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
  }
}

export default gameUtils;
