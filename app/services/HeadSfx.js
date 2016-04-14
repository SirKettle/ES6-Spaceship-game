
import Store from './Storage';
import HeadAudio from './HeadAudio';

const CHANNELS = 10;

/* *******************************
  Harrison and Elliot Audio Deck
******************************* */

class HeadSfx extends HeadAudio {

  constructor () {
    if ( !HeadSfx.isCreating ) {
      throw new Error( 'You cannot call new in Singleton instances!' );
      return;
    }

    super( 'HeadAudio', CHANNELS );

    console.log(this.channels.length);
  }

  static getInstance () {
    if ( HeadSfx.instance == null ) {
      HeadSfx.isCreating = true;
      HeadSfx.instance = new HeadSfx();
      HeadSfx.isCreating = false;
    }

    return HeadSfx.instance;
  }
}

export default HeadSfx.getInstance();
