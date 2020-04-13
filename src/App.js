import React from 'react';
import './App.css';
import MapContainer from './components/MapContainer';

const style = {
  display: 'flex',
  justifyContent: 'space-between',
};

function App() {
  return (
    <div className="App" style={style}>
      <MapContainer />
    </div>
  );
}

export default App;
