import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap-daterangepicker/daterangepicker.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-image-crop/dist/ReactCrop.css';
import 'tachyons';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
