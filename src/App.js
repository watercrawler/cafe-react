import React from 'react';
import './App.css';
import MapContainer from './components/MapContainer';
import { findByLabelText } from '@testing-library/react';
import styled from 'styled-components';

const style = {
  display: 'flex',
};

function App() {
  return (
    <div className="App" style={style}>
      <MapContainer />
    </div>
  );
}

export default App;
