import styles from './_Landing.scss';

import React from 'react';
import { Link } from 'react-router';
import Footer from '../Footer/Footer.jsx';
import RadioComponent from '../Radio/Radio.jsx';
import SettingsComponent from '../Settings/Settings.jsx';
import HeadRadio from '../../services/HeadRadio';
import MissionService from '../../services/Mission';

export default class LandingComponent extends React.Component {

  state = {
    missionKeys: MissionService.getKeys(),
    radioState: {}
  }

  componentWillMount () {
    HeadRadio.subscribe( this.onRadioUpdate );
  }

  componentWillUnmount () {
    HeadRadio.unsubscribe( this.onRadioUpdate );
  }

  componentDidMount () {
  }

  onRadioUpdate = ( state ) => {
    this.setState({
      radioState: state
    });
  }

  deleteMissionClicked ( missionKey ) {
    MissionService.remove( missionKey );
    this.setState({
      missionKeys: MissionService.getKeys()
    });
  }

  renderMissionLinks () {
    return this.state.missionKeys.map( ( key ) => {
      return (
        <p key={ `para${ key }` }>
          <Link key={ `link${ key }` } to={ `/mission/?key=${ key }` }>{ key }</Link>
          <button onClick={ this.deleteMissionClicked.bind( this, key ) }>remove</button>
        </p>
      );
    })
  }

  render () {

    return (
      <div className={ styles.Credits }>
        Landing page here...
        <h2>Missions</h2>
        { this.renderMissionLinks() }
        <SettingsComponent />
        <RadioComponent 
          data={ this.state.radioState }
        />
        <Footer />
      </div>
    );
  }
}
