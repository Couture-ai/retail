import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@fontsource/open-sans';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import setupLocatorUI from '@locator/runtime';

if (import.meta.env.MODE === 'development') {
  setupLocatorUI();
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
