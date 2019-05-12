import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import Printer from './Printer';
import ToolBar from './ToolBar';

ReactDOM.render((
  <Printer>
    <ToolBar>
      <App />
    </ToolBar>
  </Printer>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
