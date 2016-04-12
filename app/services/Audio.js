
import Store from './Storage';

const CHANNELS = 10;
const DEFAULT_MASTER_VOLUME = 0.5;

/* *******************************
  Harrison and Elliot Audio Deck
******************************* */

class HeadSfx {

  constructor () {
    if ( !HeadSfx.isCreating ) {
      throw new Error( 'You cannot call new in Singleton instances!' );
      return;
    }

    if ( Store.has( this.masterVolumeStoreKey ) ) {
      // if has volume stored - use it
      this.masterVolume = Store.get( this.masterVolumeStoreKey );
    }

    // set up the channels
    this.channels = [];
    this.channelIndex = 0;

    let channelCount = 0;
    while ( channelCount < CHANNELS ) {
      this.channels.push( document.createElement('audio') );
      channelCount += 1;
    }

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

  play ( src, volume = 1 ) {
    const channel = this.nextChannel;
    channel.src = src;
    channel.volume = Math.min( 1, Math.max( 0, volume * this.masterVolume ) );
    channel.play();
  }

  get nextChannel () {
    this.channelIndex += 1;

    if ( this.channelIndex >= this.channels.length ) {
      this.channelIndex = 0;
    }

    return this.channels[ this.channelIndex ];
  }

  get masterVolumeStoreKey () {
    return `${ this.storeKey }master_volume`;
  }

  get storeKey () {
    return '_audio__';
  }

  get masterVolume () {
    if ( typeof this._masterVolume === 'undefined' ) {
      return DEFAULT_MASTER_VOLUME;
    }

    return this._masterVolume;
  }

  set masterVolume ( vol ) {

    if ( typeof vol !== 'number' ) {
      console.warn('Volume must be a number');
      return;
    }

    if ( vol < 0 ) {
      console.warn('Volume cannot be less than zero');
      return;
    }

    if ( vol > 1 ) {
      console.warn('Volume cannot be more than one');
      return;
    }

    // store volume
    Store.set(
      this.masterVolumeStoreKey,
      this.masterVolume
    );

    return this._masterVolume = vol;
  }
}

export default HeadSfx.getInstance();
