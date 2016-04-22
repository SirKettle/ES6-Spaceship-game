import styles from './_Landing.scss';

import React from 'react';
import { Link } from 'react-router';
import Footer from '../Footer/Footer.jsx';
import DashboardComponent from '../Dashboard/Dashboard.jsx';
import MissionService from '../../services/Mission';

export default class LandingComponent extends React.Component {

  state = {
    missionKeys: MissionService.getKeys()
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
      <div className={ styles.Landing }>
        Landing page here...
        <h2>Missions</h2>
        { this.renderMissionLinks() }
        <DashboardComponent />
        <Footer />
      </div>
    );
  }
}
