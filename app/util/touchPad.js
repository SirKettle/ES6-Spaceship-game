
export const targets = {
  left: { x1: 10, x2: 60, y1: 400, y2: 500 },
  right: { x1: 10, x2: 60, y1: 400, y2: 500 },
  up: { x1: 10, x2: 60, y1: 400, y2: 500 },
  down: { x1: 10, x2: 60, y1: 400, y2: 500 },
  fire1: { x1: 10, x2: 60, y1: 400, y2: 500 },
  fire2: { x1: 10, x2: 60, y1: 400, y2: 500 }
};


const touches = {};

Object.keys(targets).forEach( ( key ) => {
  touches[ key ] = ( touchList ) => {
    return touchList.some( ( touch ) => {
      return touchPad.getIsTouch( touch, targets.left );
    });
  };
});

export touches;

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
