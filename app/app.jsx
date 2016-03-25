import './favicon.ico';
import './index.html';
import 'babel-core/polyfill';
import 'normalize.css/normalize.css';
import './scss/app.scss';

import React from 'react';
import App from './components/App/App';

const canvasConfig = {
  width: 1000,
  height: 600
};

React.render(
  <App canvasConfig={ canvasConfig } />,
  document.getElementById('app')
);
