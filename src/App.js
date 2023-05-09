import logo from './doublegeste-eau.svg';
import './App.css';
import Adresse from './Adresse';
import React, { useState, useEffect, useRef } from 'react';
//import Stations from './Stations';
import Stations from './MapGenerationFuture';
import Carte from './Carte';
import LeafletMap from './LeafletMap';
import { Link } from 'react-router-dom';





function App() {



  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>
          Ma source 
        </h1>
        <Link to="/nappe">Nappe</Link>
        <Adresse/>
        <Stations/>
        {/* <LeafletMap/> */}
       
          
      </header>
      {/* <LeafletMap/>
       */}
     

    </div>
  );
}

export default App;
