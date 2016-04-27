
const MAX_SIZE = 1024;
// const MAX_WIDTH = 1024;
// const MAX_HEIGHT = 768;
const isTouchEnabled = 'createTouch' in window.document;

const screenUtils = {

  isTouch: isTouchEnabled,

  getDimensions: () => {
    return {
      width: Math.min( window.document.body.clientWidth, MAX_SIZE ),
      height: Math.min( window.document.body.clientHeight, MAX_SIZE )
    }
  }

};

export default screenUtils;
