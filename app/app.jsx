import './favicon.ico';
import './index.html';
import 'babel-core/polyfill';
import 'normalize.css/normalize.css';
import './scss/app.scss';

import React from 'react';
import App from './components/App/App';

document.addEventListener( 'DOMContentLoaded', ( event ) => {
	setTimeout( () => {
		const canvasConfig = {
		  width: document.body.clientWidth,
		  height: document.body.clientHeight
		};
		React.render(
		  <App canvasConfig={ canvasConfig } />,
		  document.getElementById('app')
		);
	});
});

