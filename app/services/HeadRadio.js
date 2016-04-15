
import Store from './Storage';
import HeadAudio from './HeadAudio';
import radioStations from './radioStations';

const CHANNELS = 1;

/* *******************************
  Harrison and Elliot Audio Deck
******************************* */

class HeadRadio extends HeadAudio {

  constructor ( ) {
    if ( !HeadRadio.isCreating ) {
      throw new Error( 'You cannot call new in Singleton instances!' );
      return;
    }

    super( 'HeadRadio', CHANNELS );

    this.stations = radioStations;
    this.selectStation( 0 );
    this.currentTrackIndex = 0;
    this.isOn = false;
    this.currentChannel.addEventListener( 'ended', () => {
      this.playNextTrack();
    });
  }

  static getInstance () {
    if ( HeadRadio.instance == null ) {
      HeadRadio.isCreating = true;
      HeadRadio.instance = new HeadRadio();
      HeadRadio.isCreating = false;
    }

    return HeadRadio.instance;
  }

  playTrack () {
    const src = this.track.src;
    const self = this;
    super.play( src );
  }

  playNextTrack () {
    console.log('play next track');
    
    let nextTrackIndex = this.currentTrackIndex + 1;
    if ( !this.station.tracks[ nextTrackIndex ] ) {
      nextTrackIndex = 0;
    }
    this.currentTrackIndex = nextTrackIndex;
    this.playTrack();
  }

  handlePowerOn () {
    // get station
    // get src
    this.playTrack();
  }

  handlePowerOff () {
    this.pause();
  }

  // expose controls
  switchOn () {
    this.isOn = true;
  }

  switchOff () {
    this.isOn = false;
  }

  togglePower () {
    this.isOn = !this.isOn;
  }

  nextStation () {
    let nextStationIndex = this.currentStationIndex + 1;

    if ( !this.hasStation( nextStationIndex ) ) {
      nextStationIndex = 0;
    }

    this.selectStation( nextStationIndex );
  }

  prevStation () {
    let nextStationIndex = this.currentStationIndex - 1;

    if ( !this.hasStation( nextStationIndex ) ) {
      nextStationIndex = this.stations.length - 1;
    }

    this.selectStation( nextStationIndex );
  }

  selectStation ( index ) {
    this.currentStationIndex = index;

    if ( !this.isOn ) { return; }

    this.stop();
    this.playTrack();
  }

  turnUp () {
    console.log('turn up radio vol');
  }

  turnDown () {
    console.log('turn down radio vol');
  }

  hasStation ( index ) {
    return Boolean( this.stations[ index ] );
  }

  get isOn () {
    return this._isOn;
  }

  set isOn ( isOn ) {
    if ( isOn === this._isOn ) { return; }

    this._isOn = isOn;

    if ( isOn ) {
      this.handlePowerOn();
      return;
    }

    this.handlePowerOff();
  }

  get state () {
    return {
      currentTrack: this.track,
      currentStation: this.station,
      stations: this.stations
    }
  }

  get station () {
    return this.stations[ this.currentStationIndex ];
  }

  get track () {
    return this.station.tracks[ this.currentTrackIndex ];
  }

  get currentStationIndex () {
    return this._currentStationIndex;
  }

  set currentStationIndex ( index ) {

    if ( index === this._currentStationIndex ) { return; }

    if ( !this.hasStation( index ) ) {
      console.warn( 'Abort - station[index] not defined' );
      return;
    }

    this.currentTrackIndex = 0;
    this._currentStationIndex = index;
  }
}

export default HeadRadio.getInstance();
