import styles from './_Settings.scss';

import React from 'react';
import { Link } from 'react-router';
import HeadRadio from '../../services/HeadRadio';
import HeadSfx from '../../services/HeadSfx';

export default class SettingsComponent extends React.Component {

  state = {
    sfxState: {},
    radioState: {}
  }

  componentWillMount () {
    HeadSfx.subscribe( this.onSfxUpdate );
  }

  componentWillUnmount () {
    HeadSfx.unsubscribe( this.onSfxUpdate );
  }

  componentDidMount () {
  }

  onRadioUpdate = ( state ) => {
    this.setState({
      radioState: state
    });
  }

  onSfxUpdate = ( state ) => {
    this.setState({
      sfxState: state
    });
  }

  getMasterVolume () {
    return HeadSfx.masterVolume;
  }

  getSfxVolume () {
    return HeadSfx.volume;
  }

  getRadioVolume () {
    return HeadRadio.volume;
  }

  increaseMasterVolumeClicked () {
    HeadSfx.masterVolume = HeadSfx.masterVolume + 0.1;
  }

  decreaseMasterVolumeClicked () {
    HeadSfx.masterVolume = HeadSfx.masterVolume - 0.1;
  }

  increaseSfxVolumeClicked () {
    HeadSfx.volume = HeadSfx.volume + 0.1;
  }

  decreaseSfxVolumeClicked () {
    HeadSfx.volume = HeadSfx.volume - 0.1;
  }

  increaseRadioVolumeClicked () {
    HeadRadio.volume = HeadRadio.volume + 0.1;
  }

  decreaseRadioVolumeClicked () {
    HeadRadio.volume = HeadRadio.volume - 0.1;
  }

  render () {

    return (
      <div className={ styles.Settings }>
        <h2>Settings</h2>
        <p>Volume (master and sfx)</p>

        <h3>Master Volume</h3>
        <p>
          <button onClick={ this.increaseMasterVolumeClicked.bind( this ) }>Vol+</button>
          <button onClick={ this.decreaseMasterVolumeClicked.bind( this ) }>Vol-</button>
          - { this.getMasterVolume() }
        </p>

        <h3>Sound Effects</h3>
        <p>
          <button onClick={ this.increaseSfxVolumeClicked.bind( this ) }>Vol+</button>
          <button onClick={ this.decreaseSfxVolumeClicked.bind( this ) }>Vol-</button>
          - { this.getSfxVolume() }
        </p>

        <h3>Radio</h3>
        <p>
          <button onClick={ this.increaseRadioVolumeClicked.bind( this ) }>Vol+</button>
          <button onClick={ this.decreaseRadioVolumeClicked.bind( this ) }>Vol-</button>
          - { this.getRadioVolume() }
        </p>
      </div>
    );
  }
}
