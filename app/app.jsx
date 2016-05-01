import './favicon.ico';
import './index.html';
import 'babel-core/polyfill';
import 'normalize.css/normalize.css';
import './scss/app.scss';


require('file?!./assets/icons/favicon.png');
require('file?!./assets/icons/144.png');
require('file?!./assets/icons/152.png');

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import routes from './routes';

ReactDOM.render(
  <Router history={ hashHistory } routes={ routes } />,
  document.getElementById('app')
);
