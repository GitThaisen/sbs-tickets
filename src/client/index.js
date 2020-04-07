import React from 'react';
import ReactDOM from 'react-dom';
import Frontpage from './components/frontpage';
import './css/style.css'
import { injectStyle } from '@nrk/origo/jsx'  // React/Preact
injectStyle();

ReactDOM.render(
      <Frontpage/>,
      document.getElementById('react-container')
)

// Needed for Hot Module Replacement
if(typeof(module.hot) !== 'undefined') {
      module.hot.accept() // eslint-disable-line no-undef  
}