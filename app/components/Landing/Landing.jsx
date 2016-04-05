import styles from './_Landing.scss';

import React from 'react';
import { Link } from 'react-router';
import Footer from '../Footer/Footer.jsx';
import MissionService from '../../services/Mission';

export default class LandingComponent extends React.Component {


  componentWillUnmount () {
  }

  componentDidMount () {
  }

  renderMissionLinks () {
    const allMissionKeys = MissionService.getMissionKeys();
    return allMissionKeys.map( ( key ) => {
      return (
        <p key={ `para${ key }` }>
          <Link key={ `link${ key }` } to={ `/mission/?id=${ key }` }>{ key }</Link>
        </p>
      );
    })
  }

  render () {

    // need to start using a service here to get missions....
    const missionId = 'Default';

    const missionParams = {
      id: missionId
    };

    return (
      <div className={ styles.Credits }>
        Landing page here...
        <h2>Missions</h2>
        { this.renderMissionLinks() }
        <Footer />
      </div>
    );
  }
}
