import styles from './_Settings.scss';

import React from 'react';
import { Link } from 'react-router';
import HeadRadio from '../../services/HeadRadio';
import HeadSfx from '../../services/HeadSfx';

export default class SettingsComponent extends React.Component {

  static propTypes = {
      onCloseRequested: React.PropTypes.func
  }

  static defaultProps = {
    onCloseRequested: () => {}
  }

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
    HeadSfx.turnUpMaster();
  }

  decreaseMasterVolumeClicked () {
    HeadSfx.turnDownMaster();
  }

  increaseSfxVolumeClicked () {
    HeadSfx.turnUp();
  }

  decreaseSfxVolumeClicked () {
    HeadSfx.turnDown();
  }

  increaseRadioVolumeClicked () {
    HeadRadio.turnUp();
  }

  decreaseRadioVolumeClicked () {
    HeadRadio.turnDown();
  }

  render () {

    return (
      <div className={ styles.settings }>
        <button
          className={ styles.closeButton }
          onClick={ this.props.onCloseRequested }
        >X</button>
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
