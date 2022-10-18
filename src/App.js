import logo from './doublegeste-eau.svg';
import './App.css';
import Adresse from './Adresse';
import React, { useState, useEffect, useRef } from 'react';





function App() {



  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Ma source App
        </p>
        <Adresse/>
          
      </header>
     

    </div>
  );
}

export default App;
