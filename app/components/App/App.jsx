import styles from './_App.scss';

import React from 'react';
import Rx from 'rx';
import AppActions from '../../actions/AppActions';
import ItemsStore from '../../stores/ItemsStore';
import Body from '../Body/Body';
import Footer from '../Footer/Footer';

function getAppState() {
  return {
    items: ItemsStore.getAll(),
    keysDown: {}
  };
}


const keyDowns = Rx.Observable.fromEvent(document, 'keydown');
const keyUps = Rx.Observable.fromEvent(document, 'keyup');
const keyActions = Rx.Observable
    .merge( keyDowns, keyUps )
    .filter( () => {
      const keysPressed = {};
      return ( event ) => {
        const key = event.key || event.which;
        if ( event.type === 'keyup' ) {
          delete keysPressed[key];
          return true;
        }
        if ( event.type === 'keydown' ) {
          if ( keysPressed[key] ) {
            return false;
          }
          keysPressed[key] = true;
          return true;
        }
      };
    } );

export default class App extends React.Component {

  state = getAppState()

  componentDidMount() {
    ItemsStore.addChangeListener(this.onChange);
    AppActions.getItems();


    const { keysDown } = this.state;

    this.subscription = keyActions.subscribe( (event) => {
      const key = event.key || event.which;
      console.log( event.type, key, event.keyIdentifier, event.code );

      if ( event.type === 'keyup' ) {
        delete keysDown[key];
      }
      if ( event.type === 'keydown' ) {
        keysDown[key] = true;
      }

      this.setState({
        keysDown: keysDown
      })
    });
  }

  componentWillUnmount() {
    ItemsStore.removeChangeListener(this.onChange);
  }



  componentWillMount() {
  }

  componentWillUnmount() {
    this.subscription.dispose();
  }

  onChange = () => {
    this.setState(getAppState());
  }

  render() {
    return (
      <div className={styles.app}>
        <p>{ Object.keys(this.state.keysDown).join(' - ') }</p>
        <Body items={this.state.items} />
        <Footer />
      </div>
    );
  }
}
