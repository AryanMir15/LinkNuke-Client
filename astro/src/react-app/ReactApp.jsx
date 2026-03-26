import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppWrapper from '../components/components/ui/AppWrapper.jsx';

export default function ReactApp() {
  return (
    <BrowserRouter basename="/app">
      <AppWrapper />
    </BrowserRouter>
  );
}
