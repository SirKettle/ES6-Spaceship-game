
// These need to match the buttons in the touchPad
export const targets = {
  left: { x1: 10, x2: 80, y1: 440, y2: 490 },
  right: { x1: 90, x2: 160, y1: 440, y2: 490 },
  up: { x1: 50, x2: 120, y1: 390, y2: 440 },
  down: { x1: 50, x2: 120, y1: 490, y2: 540 },
  fire1: { x1: 250, x2: 300, y1: 440, y2: 490 },
  fire2: { x1: 320, x2: 370, y1: 440, y2: 490 }
};


export const touches = {};

Object.keys(targets).forEach( ( key ) => {
  touches[ key ] = ( touchList ) => {
    return touchList.some( ( touch ) => {
      return touchPad.getIsTouch( touch, targets[ key ] );
    });
  };
});



const touchPad = {
  getIsTouch: ( touch, target ) => {
    return Boolean(
      touch.pageX >= target.x1 &&
      touch.pageX <= target.x2 &&
      touch.pageY >= target.y1 &&
      touch.pageY <= target.y2
    );
  },
  targets: targets,
  touches: touches
};

export default touchPad;
