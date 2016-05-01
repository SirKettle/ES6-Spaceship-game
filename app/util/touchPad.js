
import screenUtils from './screen';

const buttonPositions = {
  left: { bottom: 90, left: 20, width: 70, height: 50 },
  right: { bottom: 90, left: 100, width: 70, height: 50 },
  up: { bottom: 140, left: 60, width: 70, height: 50 },
  down: { bottom: 40, left: 60, width: 70, height: 50 },
  fire1: { bottom: 90, right: 90, width: 50, height: 50 },
  fire2: { bottom: 90, right: 20, width: 50, height: 50 }
};

// These need to match the buttons in the touchPad
export const getTargets = () => {

  const screen = {
    width: screenUtils.getWidth(),
    height: screenUtils.getHeight()
  };

  const targets = {};

  Object.keys( buttonPositions ).forEach( ( key ) => {
    const pos = buttonPositions[ key ];
    const left = buttonPositions.left || screen.width - pos.right - pos.width;
    const top = buttonPositions.top || screen.height - pos.bottom - pos.height;

    targets[ key ] = {
      x1: left,
      x2: left + pos.width,
      y1: top,
      y2: top + pos.height
    };
  });

  return targets;
  // return {
  //   left: { x1: 10, x2: 80, y1: 440, y2: 490 },
  //   right: { x1: 90, x2: 160, y1: 440, y2: 490 },
  //   up: { x1: 50, x2: 120, y1: 390, y2: 440 },
  //   down: { x1: 50, x2: 120, y1: 490, y2: 540 },
  //   fire1: { x1: 250, x2: 300, y1: 440, y2: 490 },
  //   fire2: { x1: 320, x2: 370, y1: 440, y2: 490 }
  // };
};

export const touches = {};

Object.keys( buttonPositions ).forEach( ( key ) => {
  touches[ key ] = ( touchList, targets ) => {
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
  getTargets: getTargets,
  touches: touches
};

export default touchPad;
