
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
    this.currentChannel.audio.addEventListener( 'ended', () => {
      this.nextTrack();
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
    super.play( src );
    console.log('playTrack');
    this.emitUpdate();
  }

  handlePowerOn () {
    // get station
    // get src
    this.playTrack();
    this.emitUpdate();
  }

  handlePowerOff () {
    this.pause();
    this.emitUpdate();
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

  nextTrack () {
    let nextTrackIndex = this.currentTrackIndex + 1;
    
    if ( !this.station.tracks[ nextTrackIndex ] ) {
      nextTrackIndex = 0;
    }

    this.selectTrack( nextTrackIndex );
  }

  prevTrack () {
    let nextTrackIndex = this.currentTrackIndex - 1;
    
    if ( !this.station.tracks[ nextTrackIndex ] ) {
      nextTrackIndex = this.station.tracks.length - 1;
    }

    this.selectTrack( nextTrackIndex );
  }

  selectTrack ( index ) {

    if ( !this.isOn ) { return; }

    this.stop();
    this.currentTrackIndex = index;
    this.playTrack();
    this.emitUpdate();
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
    this.emitUpdate();
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
    const state = {
      currentTrack: this.track,
      currentStation: this.station,
      stations: this.stations,
      isOn: this.isOn,
      subscribers: this.subscribers,
      text: {
        station: null,
        playing: null,
        summary: null
      },
      volume: this.volume
    };

    if ( state.isOn ) {
      state.text.station = state.currentStation.station;
      state.text.playing = `${ state.currentTrack.title } by ${ state.currentTrack.artist }`;
      state.text.summary = `${ state.text.station } - ${ state.text.playing }`;
    } else {
      state.text.summary = 'Off';
    }

    return state;
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
