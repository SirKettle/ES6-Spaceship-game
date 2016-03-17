import styles from './_App.scss';

import React from 'react';
import Rx from 'rx';
import AppActions from '../../actions/AppActions';
import ItemsStore from '../../stores/ItemsStore';
import Body from '../Body/Body';
import Footer from '../Footer/Footer';
import Game from '../Game/Game';
import KeyboardService from '../../services/Keyboard';

function getAppState() {
  return {
    items: ItemsStore.getAll(),
    keysDown: {}
  };
}

export default class App extends React.Component {

  state = getAppState();

  renderKeysDown = () => {
    return Object.keys(this.state.keysDown)
      .map( (keyCode) => {
        const { display } = this.state.keysDown[ keyCode ];
        return (
          <span>{ display }</span>
        );
      });
  }

  renderConsoleOutput = () => {
    // TODO: This needs to iterate through an array/object to output anything
    // needed in the console
    return (
      <div>
        <h3>Console</h3>
        <p>Keys down: <strong>{ this.renderKeysDown() }</strong></p>
      </div>
    );
  }

  componentDidMount() {
    ItemsStore.addChangeListener(this.onChange);
    AppActions.getItems();


    const { keysDown } = this.state || {};

    this.streams = {};

    this.streams.keyboard = KeyboardService.stream.subscribe( (event) => {
      const keyCode = event.key || event.which;
      const character = String.fromCharCode(keyCode);

      if ( event.type === 'keyup' ) {
        delete keysDown[keyCode];
      }
      if ( event.type === 'keydown' ) {
        keysDown[keyCode] = {
          code: keyCode,
          display: character
        };
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
    this.streams.keyboard.dispose();
  }

  onChange = () => {
    this.setState(getAppState());
  }

  render() {

    const gameState = {
      running: true,
      score: {
        score: 10
      },
      data: {
        somethings: [ 1, 2, 3 ],
        keysDown: this.state.keysDown
      }
    };

    const canvasConfig = {
      width: 600,
      height: 400
    };

    const onCanvasClicked = ( event ) => {
      console.log(event);
    };

    return (
      <div className={styles.app}>
        <Game
          gameState={ gameState }
          canvas={ canvasConfig }
          onCanvasClicked={ onCanvasClicked }
        />
        <Body items={this.state.items} />
        <Footer />
        <div class={ styles.console }>
          { this.renderConsoleOutput() }
        </div>
      </div>
    );
  }
}
