import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Urlstest from './models/Urlstest';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(

  <React.StrictMode>
    <Urlstest />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
