import styles from './_Dashboard.scss';

import React from 'react';
import SettingsComponent from '../Settings/Settings.jsx';
import RadioComponent from '../Radio/Radio';
import HeadRadio from '../../services/HeadRadio';

require('file?!../../assets/dash.png');

export default class DashboardComponent extends React.Component {

  static propTypes = {
    stats: React.PropTypes.arrayOf(React.PropTypes.object)
  }

  static defaultProps = {
    stats: []
  }

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

  renderStats() {
    return this.props.stats.map( ( stat ) => {
      return (
        <tr key={ stat.label }><th>{ stat.label }</th><td>{ stat.value }</td></tr>
      );
    });
  }

  render () {

    return (
      <div className={ styles.dashboard }
        style={
          {
            backgroundImage: 'url(../../assets/dash.png)'
          }
        }
      >
        <RadioComponent data={ this.state.radioState } />

        <table className={ styles.stats }>
          <tbody>
            { this.renderStats() }
          </tbody>
        </table>

        <SettingsComponent />
      </div>
    );
  }
}
