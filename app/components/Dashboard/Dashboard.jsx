import styles from './_Dashboard.scss';

import React from 'react';
import SettingsComponent from '../Settings/Settings.jsx';
import RadioComponent from '../Radio/Radio';
import HeadRadio from '../../services/HeadRadio';

require('file?!../../assets/dash.png');

export default class DashboardComponent extends React.Component {

  state = {
    radioState: {}
  }

  onRadioUpdate = ( state ) => {
    this.setState({
      radioState: state
    });
  }

  // react core methods

  componentWillMount () {
    HeadRadio.subscribe( this.onRadioUpdate );
  }

  componentWillUnmount () {
    HeadRadio.unsubscribe( this.onRadioUpdate );
  }

  render () {

    return (
      <div className={ styles.Dashboard }
        style={
          {
            backgroundImage: 'url(../../assets/dash.png)'
          }
        }
      >
        <RadioComponent data={ this.state.radioState } />
        <SettingsComponent />
      </div>
    );
  }
}
