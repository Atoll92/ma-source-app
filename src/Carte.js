import GeoTIFF from 'ol/source/GeoTIFF';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/WebGLTile';
import View from 'ol/View';
import React from 'react';
import OSM from 'ol/source/OSM';
import { useState } from 'react';
import "../node_modules/ol/ol.css"
// import setMap

const Carte = () => {


    const map = new Map({
        target: 'map3',
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: [0, 0],
          zoom: 8,
        }),
      });




    return (
        <div>
            <div id="map3" class="map3"></div>
  
        </div>
    );
};

export default Carte;
