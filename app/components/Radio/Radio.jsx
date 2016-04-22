import styles from './_Radio.scss';

import React from 'react';
import HeadRadio from '../../services/HeadRadio';

export default class RadioComponent extends React.Component {

  static propTypes = {
    data: React.PropTypes.shape({
      currentTrack: React.PropTypes.object,
      currentStation: React.PropTypes.object,
      stations: React.PropTypes.arrayOf(React.PropTypes.object),
      isOn: React.PropTypes.bool,
      subscribers: React.PropTypes.arrayOf(React.PropTypes.func),
      text: React.PropTypes.shape({
        station: React.PropTypes.string,
        playing: React.PropTypes.string,
        summary: React.PropTypes.string
      }),
      volume: React.PropTypes.number
    })
  }

  onPowerClicked () {
    HeadRadio.togglePower();
  }

  onVolumeDecreaseClicked () {
    HeadRadio.turnDown();
  }

  onVolumeIncreaseClicked () {
    HeadRadio.turnUp();
  }

  onPrevTrackClicked () {
    HeadRadio.prevTrack();
  }

  onNextTrackClicked () {
    HeadRadio.nextTrack();
  }

  onPrevStationClicked () {
    HeadRadio.prevStation();
  }

  onNextStationClicked () {
    HeadRadio.nextStation();
  }

  render () {

    const { data } = this.props;

    return (
      <div className={ styles.radio }>
        <div className={ styles.controls }>
          <button className="power" onClick={ this.onPowerClicked.bind(this) }>{ data && data.isOn ? 'Switch off' : 'Switch on' }</button>
          <button className="volume-dec" onClick={ this.onVolumeDecreaseClicked.bind(this) }>vol-</button>
          <button className="volume-inc" onClick={ this.onVolumeIncreaseClicked.bind(this) }>vol+</button>
          <button className="track-prev" onClick={ this.onPrevTrackClicked.bind(this) }>Tr-</button>
          <button className="track-next" onClick={ this.onNextTrackClicked.bind(this) }>Tr+</button>
          <button className="station-prev" onClick={ this.onPrevStationClicked.bind(this) }>Ch-</button>
          <button className="station-next" onClick={ this.onNextStationClicked.bind(this) }>Ch+</button>
        </div>
        <div className={ styles.display }>{ data.text.summary }</div>
      </div>
    );
  }
}
