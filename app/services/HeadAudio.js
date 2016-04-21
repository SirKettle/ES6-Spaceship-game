
import Store from './Storage';
import validate from '../util/validate';
import numberUtils from '../util/number';

const DEFAULT_MASTER_VOLUME = 0.5;

/* *******************************
  Harrison and Elliot Audio Deck
******************************* */

class HeadAudio {

  constructor ( name, channels = 10 ) {

  	// set the store key
    this.storeKey = `_${ name }__`;

    this.subscribers = [];

    // set up the channels
    this.channels = [];
    this.channelIndex = 0;

    let channelCount = 0;

    while ( channelCount < channels ) {
      this.channels.push({
        audio: document.createElement('audio'),
        volume: 0
      });
      channelCount += 1;
    }

    // get and set the volume
    if ( Store.has( this.volumeStoreKey ) ) {
      // if has volume stored - use it
      this.volume = Store.get( this.volumeStoreKey );
    }
  }

  updateVolume () {
    this.channels.forEach( ( channel ) => {
      if ( typeof channel.audio === 'object' ) {
        channel.audio.volume = Math.min( 1, Math.max( 0, channel.volume * this.volume * this.masterVolume ) );
      }
    });
  }

  play ( src, volume = 1 ) {
    const channel = this.nextChannel;
    channel.volume = volume;
    channel.audio.src = src;
    channel.audio.play();
    this.updateVolume();
  }

  pause () {
  	const channel = this.currentChannel;
    channel.audio.pause();
  }

  stop () {
    const channel = this.currentChannel;
    channel.audio.pause();
    channel.audio.src = '';
  }

  isValidVolume ( vol ) {
    return validate.number.between( vol, 0, 1 );
  }

  subscribe ( subscription ) {
    this.subscribers.push( subscription );
    this.emitUpdate();
  }

  unsubscribe ( subscription ) {
    const index = this.subscribers.indexOf( subscription );
    if ( index !== -1 ) {
      console.log('unsubscribed!!')
      this.subscribers.splice( index, 1 );
    }
  }

  emitUpdate () {
    this.subscribers.forEach( ( subscription ) => {
      subscription( this.state );
    });
  }

  turnUp ( by = 0.1 ) {
    this.volume = numberUtils.safeIncrementBy( this.volume, by );
  }

  turnDown ( by = 0.1 ) {
    this.volume = numberUtils.safeIncrementBy( this.volume, -by );
  }

  turnUpMaster ( by = 0.1 ) {
    this.masterVolume = numberUtils.safeIncrementBy( this.masterVolume, by );
  }

  turnDownMaster ( by = 0.1 ) {
    this.masterVolume = numberUtils.safeIncrementBy( this.masterVolume, -by );
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
    this.updateVolume();
    this.emitUpdate();
  }

  get masterVolume () {
    return HeadAudio.masterVolume;
  }

  set masterVolume ( vol ) {
    if ( !this.isValidVolume( vol ) ) {
      return;
    }
    // store volume
    Store.set( HeadAudio.masterVolumeStoreKey, vol );
    // set volumne
    HeadAudio.masterVolume = vol;
    this.updateVolume();
    this.emitUpdate();
  }

  get state () {
    const state = {
      volume: this.volume,
      masterVolume: this.masterVolume
    };

    return state;
  }
}

HeadAudio.masterVolume = DEFAULT_MASTER_VOLUME;
HeadAudio.masterVolumeStoreKey = '_HeadAudio__master_volume';

// get and set the master volume
if ( Store.has( HeadAudio.masterVolumeStoreKey ) ) {
  // if has volume stored - use it
  HeadAudio.masterVolume = Store.get( HeadAudio.masterVolumeStoreKey );
}


export default HeadAudio;
