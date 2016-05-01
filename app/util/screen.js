
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
	},

	findPos: () => ( obj ) => {
		let curleft = 0;
		let curtop = 0;

		if ( obj.offsetParent ) {
			do {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			} while ( obj = obj.offsetParent );

			return {
				x: curleft - document.body.scrollLeft,
				y: curtop - document.body.scrollTop
			};
		}
	},

	isTouchInBounds: ( el, touch ) => {
		if ( !el && !touch ) { return; }
		const offset = screenUtils.findPos( el );
		return Boolean(
			!!offset &&
			touch.clientX - offset.x > 0 &&
			touch.clientX - offset.x < parseFloat( el.width ) &&
			touch.clientY - offset.y > 0 &&
			touch.clientY - offset.y < parseFloat( el.height )
		);
	}

};

export default screenUtils;
