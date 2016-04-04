import styles from './_Credits.scss';

import React from 'react';
import Footer from '../Footer/Footer.jsx';

export default class CreditsComponent extends React.Component {


  componentWillUnmount () {
  }

  componentDidMount () {
  }

  render () {

    return (
      <div className={ styles.Credits }>
        Credits here...
        <Footer />
      </div>
    );
  }
}
