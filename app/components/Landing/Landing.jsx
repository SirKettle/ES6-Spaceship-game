import styles from './_Landing.scss';

import React from 'react';
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
        <Footer />
      </div>
    );
  }
}
