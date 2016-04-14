
import Store from './Storage';

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

  get masterVolumeStoreKey () {
    return `_head_audio__master_volume`;
  }

  get volumeStoreKey () {
    return `${ this.storeKey }volume`;
  }

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
      this.volumeStoreKey,
      vol
    );

    return this._volume = vol;
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
      vol
    );

    return this._masterVolume = vol;
  }
}

export default HeadAudio;
