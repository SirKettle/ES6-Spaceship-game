
const numberUtils = {

  pad: ( number, width ) => {
    const n = Number(number).toString();
    if (n !== 'NaN') {
      return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
    }
    return null;
  },

  toPrecision: ( rawValue, precision = 4 ) => {
    // To avoid precision errors in JavaScript use integers...
    const scale = Math.pow( 10, precision );
    return Math.round( rawValue * scale ) / scale;
  },

  toPercentString: ( decimal, precision = 3 ) => {
    return `${numberUtils.toPrecision( decimal * 100, precision )}%`;
  },

  safeIncrementBy: ( initialVal, incrementVal, precision = 4 ) => {
    return numberUtils.toPrecision( initialVal + incrementVal, precision );
  }
};


export default numberUtils;
