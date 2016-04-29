
const MAX_SIZE = 1024;
const PIXEL_RATIO = window.devicePixelRatio || 1;
// const MAX_WIDTH = 1024;
// const MAX_HEIGHT = 768;
const isTouchEnabled = 'createTouch' in window.document;

const getWidth = () => {
	return window.document.body.clientWidth;
	return Math.min( window.screen.width * PIXEL_RATIO, MAX_SIZE );
}

const getHeight = () => {
	return window.document.body.clientHeight;
	return Math.min( window.screen.height * PIXEL_RATIO, MAX_SIZE );
}

const screenUtils = {

  isTouch: isTouchEnabled,

  getDimensions: () => {
    return {
      // width: screen.width,
      // height: screen.height
      width: getWidth(),
      height: getHeight()
    }
  }

};

export default screenUtils;
