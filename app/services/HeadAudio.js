
import Store from './Storage';
import validate from '../util/validate';

const DEFAULT_MASTER_VOLUME = 0.5;

/* *******************************
  Harrison and Elliot Audio Deck
******************************* */

class HeadAudio {

  constructor ( name, channels = 10 ) {

  	// set the store key
    this.storeKey = `_${ name }__`;

    // set up the channels
    this.channels = [];
    this.channelIndex = 0;

    let channelCount = 0;

    while ( channelCount < channels ) {
      this.channels.push( document.createElement('audio') );
      channelCount += 1;
    }

    // get and set the master volume
    if ( Store.has( this.masterVolumeStoreKey ) ) {
      // if has volume stored - use it
      this.masterVolume = Store.get( this.masterVolumeStoreKey );
    }

    // get and set the volume
    if ( Store.has( this.volumeStoreKey ) ) {
      // if has volume stored - use it
      this.volume = Store.get( this.volumeStoreKey );
    }
  }

  play ( src, volume = 1 ) {
    const channel = this.nextChannel;
    channel.src = src;
    channel.volume = Math.min( 1, Math.max( 0, volume * this.volume * this.masterVolume ) );
    channel.play();
  }

  pause () {
  	const channel = this.currentChannel;
    channel.pause();
  }

  stop () {
    const channel = this.currentChannel;
    channel.pause();
    channel.src = '';
  }

  isValidVolume ( vol ) {
    return validate.number.between( vol, 0, 1 );
  }

  get currentChannel () {
    return this.channels[ this.channelIndex ];
  }

  get nextChannel () {
    this.channelIndex += 1;

    if ( this.channelIndex >= this.channels.length ) {
      this.channelIndex = 0;
    }

    return this.currentChannel;
  }

  // Store keys for saving state
  // Master volume: represents the volume of all audio
  get masterVolumeStoreKey () {
    return `_HeadAudio__master_volume`;
  }

  // Volume: represents the volume of the class (ie HeadRadio)
  get volumeStoreKey () {
    return `${ this.storeKey }volume`;
  }

  // The store key of the class (ie )
  get storeKey () {
    return this._storeKey;
  }

  set storeKey ( key ) {
    this._storeKey = key;
  }

  get volume () {
    if ( typeof this._volume === 'undefined' ) {
      return 1;
    }

    return this._volume;
  }

  set volume ( vol ) {
    if ( !this.isValidVolume( vol ) ) {
      return;
    }
    // store volume
    Store.set( this.volumeStoreKey, vol );
    // set volumne
    this._volume = vol;
  }

  get masterVolume () {
    if ( typeof this._masterVolume === 'undefined' ) {
      return DEFAULT_MASTER_VOLUME;
    }

    return this._masterVolume;
  }

  set masterVolume ( vol ) {
    if ( !this.isValidVolume( vol ) ) {
      return;
    }
    // store volume
    Store.set( this.masterVolumeStoreKey, vol );
    // set volumne
    this._masterVolume = vol;
  }
}

export default HeadAudio;
