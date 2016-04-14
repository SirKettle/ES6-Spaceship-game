
import Store from './Storage';
import HeadAudio from './HeadAudio';
import radioStations from './radioStations';

const CHANNELS = 3;

/* *******************************
  Harrison and Elliot Audio Deck
******************************* */

class HeadRadio extends HeadAudio {

  constructor ( isOn = true ) {
    if ( !HeadRadio.isCreating ) {
      throw new Error( 'You cannot call new in Singleton instances!' );
      return;
    }

    super( 'HeadRadio', CHANNELS );

    this.stations = radioStations;
    this.selectStation( 0 );
    this.currentTrackIndex = 0;
    this.isOn = isOn;
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
    this.play( src );
  }

  playNextTrack () {

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

  nextStation () {
    let nextStationIndex = this.currentStationIndex + 1;

    if ( !this.hasStation( nextStationIndex ) ) {
      nextStationIndex = 0;
    }

    this.currentStationIndex = nextStationIndex;

    if 
  }

  prevStation () {
    let nextStationIndex = this.currentStationIndex - 1;

    if ( !this.hasStation( nextStationIndex ) ) {
      nextStationIndex = this.stations.length - 1;
    }

    this.currentStationIndex = nextStationIndex;
  }

  selectStation ( index ) {
    this.currentStationIndex = index;
  }

  turnUp () {
    console.log('turn up radio vol');
  }

  turnDown () {
    console.log('turn down radio vol');
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

  get station () {
    return this.stations[ this.currentStationIndex ];
  }

  get track () {
    return this.station.tracks[ this.currentTrackIndex ];
  }

  get currentStationIndex () {
    return this._currentStationIndex;
  }

  get hasStation ( index ) {
    return Boolean( this.stations[ index ] );
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
