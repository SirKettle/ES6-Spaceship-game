import styles from './_Landing.scss';

import React from 'react';
import { Link } from 'react-router';
import Footer from '../Footer/Footer.jsx';

export default class LandingComponent extends React.Component {


  componentWillUnmount () {
  }

  componentDidMount () {
  }

  render () {

    return (
      <div className={ styles.Credits }>
        Landing page here...
        <Link to="/mission">Start mission</Link>
        <Footer />
      </div>
    );
  }
}
