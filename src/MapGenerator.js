import React, { useState } from 'react';
import Map from 'ol/Map';   
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import { useEffect } from 'react';



// import TileLayer from 'ol/layer/Tile';
import { useGeographic } from 'ol/proj';

import 'ol/ol.css';
import Point from 'ol/geom/Point';

import Feature from 'ol/Feature';


import Circle from 'ol/geom/Circle';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Stroke from 'ol/style/Stroke';


import {Circle as CircleStyle} from 'ol/style';
import { Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';


const MapGenerator = (props) => {

    useEffect(  () => {

console.log("props.Coordinates is :" + props.Coordinates)
    },[props.Coordinates])
    // const [map, setMap] = useState([]);

    // const image = new CircleStyle({
    //     radius: 2,
    //     fill: null,
    //     stroke: new Stroke({color: 'green', width: 2}),
    // });

    // const image2 = new Icon({
    //     anchor: [0.5, 0.5],
    //     anchorXUnits: 'fraction',
    //     anchorYUnits: 'fraction',
    //     src: '../doublegeste-eau.svg'
    // })

    
    // const styles = {
    //     'Point': new Style({
    //         image: image,
    //     }),
    //     'LineString': new Style({
    //         stroke: new Stroke({
    //         color: 'green',
    //         width: 1,
    //         }),
    //     }),
        
    //     'MultiPoint': new Style({
    //         image: image2,
    //     }),
    //     // 'MultiPolygon': new Style({
    //     //   stroke: new Stroke({
    //     //     color: 'yellow',
    //     //     width: 1,
    //     //   }),
    //     //   fill: new Fill({
    //     //     color: 'rgba(255, 255, 0, 0.1)',
    //     //   }),
    //     // }),
    //     // 'Polygon': new Style({
    //     //   stroke: new Stroke({
    //     //     color: 'blue',
    //     //     lineDash: [4],
    //     //     width: 3,
    //     //   }),
    //     //   fill: new Fill({
    //     //     color: 'rgba(0, 0, 255, 0.1)',
    //     //   }),
    //     // }),
    //     // 'GeometryCollection': new Style({
    //     //   stroke: new Stroke({
    //     //     color: 'magenta',
    //     //     width: 2,
    //     //   }),
    //     //   fill: new Fill({
    //     //     color: 'magenta',
    //     //   }),
    //     //   image: new CircleStyle({
    //     //     radius: 10,
    //     //     fill: null,
    //     //     stroke: new Stroke({
    //     //       color: 'magenta',
    //     //     }),
    //     //   }),
    //     // }),
    //     // 'Circle': new Style({
    //     //   stroke: new Stroke({
    //     //     color: 'green',
    //     //     width: 10,
    //     //   }),
    //     //   fill: new Fill({
    //     //     color: 'rgba(255,0,0,0.2)',
    //     //   }),
    //     // }),
    // };
    
    // const styleFunction = function (feature) {
    //     return styles[feature.getGeometry().getType()];
    // };

    // const geojsonObject = {
    //     'type': 'FeatureCollection',
    //     'crs': {
    //         'type': 'name',
    //         'properties': {
    //         'name': 'EPSG:3857',
    //         },
    //     },
    //     // 'features': Coords.features
    //     'features': [
    //         //   {
    //         //     'type': 'Feature',
    //         //     'geometry': {
    //         //       'type': 'Point',
    //         //       'coordinates': Coordinates[1],
    //         //     }},
    //         {
    //             'type': 'Feature',
    //             'geometry': {
    //             'type': 'MultiPoint',
    //             'coordinates': props.Coordinates,
    //         }},
    //         {
    //             'type': 'Feature',
    //             'geometry': {
    //             'type': 'MultiPoint',
    //             'coordinates': props.Coordinates,
    //         }},
    //         {
    //             'type': 'Feature',
    //             'geometry': {
    //             'type': 'Point',
    //             'coordinates': props.Coordinates[2],
    //         }},
    //         {
    //             'type': 'Feature',
    //             'geometry': {
    //             'type': 'Point',
    //             'coordinates': props.Coordinates[24],
    //         }},

    //         {
    //             'type': 'Feature',
    //             'geometry': {
    //             'type': 'Point',
    //             'coordinates': props.Coordinates[65],
    //         }},
    //     ]
    // }
    
    // const vectorSource = new VectorSource({
    //     features: new GeoJSON().readFeatures(geojsonObject),
    // });
    
    // vectorSource.addFeature(new Feature(new Circle([5e6, 7e6], 1e6)));
    
    // const vectorLayer = new VectorLayer({
    //     source: vectorSource,
    //     style: styleFunction,
    // });


   
    //         const initialMap = new Map({
    //             target: 'map4',
    //             layers: [
    //                 new TileLayer({
    //                     source: new OSM(),
    //                 }), 
    //                 vectorLayer , 
    //             ],
    //             view: new View({
    //             center: props.Coordinates[0],
    //                 zoom: 7,
    //             }),
    //         });

    //         setMap(initialMap);
          
      
  
    // useEffect(() => {
    //     if(map){
    //         vectorLayer.changed() 
    //     }
    // }, [props.Coordinates]);

return (
    <div>
        <div className="map4" id="map4" />
    </div>
)}

export default MapGenerator;