
const CHANNELS = 10;

class HeadSfx {

  constructor () {
    if ( !HeadSfx.isCreating ) {
      throw new Error( 'You cannot call new in Singleton instances!' );
      return;
    }

    this.channels = [];
    this.channelIndex = 0;
    this.masterVolume = 0.5;

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

  get masterVolume () {
    return this._masterVolume;
  }

  set masterVolume ( vol ) {
    return this._masterVolume = vol;
  }
}

export default HeadSfx.getInstance();