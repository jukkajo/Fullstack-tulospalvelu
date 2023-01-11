import React from 'react';
import ReactDOM from 'react-dom/client';
import './tyylit.css';
import Toiminta from './Toiminta';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById("uloin_div"));
root.render(
  <React.StrictMode>
    <Toiminta />
  </React.StrictMode>
);

reportWebVitals();
