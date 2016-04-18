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
      subscribers: React.PropTypes.arrayOf(React.PropTypes.func)
    })
  }

  onPowerClicked () {
    HeadRadio.togglePower();
    const state = HeadRadio.state;
    console.log( state );
  }

  onVolumeDecreaseClicked () {
    HeadRadio.turnDown();
    const state = HeadRadio.state;
    console.log( state );
  }

  onVolumeIncreaseClicked () {
    HeadRadio.turnUp();
    const state = HeadRadio.state;
    console.log( state );
  }

  onPrevStationClicked () {
    HeadRadio.prevStation();
    const state = HeadRadio.state;
    console.log( state );
  }

  onNextStationClicked () {
    HeadRadio.nextStation();
    const state = HeadRadio.state;
    console.log( state );
  }

  render () {

    const { data } = this.props;

    return (
      <div className={ styles.Radio }>
        <button onClick={ this.onPowerClicked.bind(this) }>{ data && data.isOn ? 'Switch off' : 'Switch on' }</button>
        <button onClick={ this.onVolumeDecreaseClicked.bind(this) }>vol-</button>
        <button onClick={ this.onVolumeIncreaseClicked.bind(this) }>vol+</button>
        <button onClick={ this.onPrevStationClicked.bind(this) }>prev</button>
        <button onClick={ this.onNextStationClicked.bind(this) }>next-</button>
      </div>
    );
  }
}
