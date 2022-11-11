import React from 'react';
import Papa from 'papaparse';
import { useState } from 'react';
import { useEffect } from 'react';
import GeoJSON from 'ol/format/GeoJSON';
import MultiPoint from 'ol/geom/MultiPoint';
import LineString from 'ol/geom/LineString';


import { Map, View } from 'ol';
// import TileLayer from 'ol/layer/Tile';
import { useGeographic } from 'ol/proj';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
// import Feature from 'ol/Feature';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';

import Fill from 'ol/style/Fill';
import Carte from './Carte';
import Circle from 'ol/geom/Circle';
import Style from 'ol/style/Style';
import Projection from 'ol/proj/Projection';
import { Transform } from 'ol/transform';
import Icon from 'ol/style/Icon';
import Stroke from 'ol/style/Stroke';
import Graticule from 'ol/layer/Graticule';

import {Circle as CircleStyle} from 'ol/style';
import { Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import MapGenerator from './MapGenerator';










const Stations = (Communes) => {

    // State to store parsed data
    const [parsedData, setParsedData] = useState([]);

    //State to store table Column name
    const [tableRows, setTableRows] = useState([]);

    //State to store the values
    const [values, setValues] = useState([]);

    //Store fetched data & associated station
    const [Stations, setStations] = useState([]);

    const [CommunesCoords , SetCoco] = useState([])

    const [Coords_results, setCoordsResults]  = useState([])
    const [Coords , setCoords] = useState([]);
    const [Coordinates, setCoordinates] = useState([]);
    const [map, setMap] = useState();

    function checklogs() {
        console.log(Coordinates[1][0]);
        console.log(Coordinates.length);
        console.log(CommunesCoords);
       
        // useEffect(() => {
   
        //     if(map){
            
        //         map.render();
             
      
              
        //     } else {
        //         newMap()
        //     }
        //    }, [Coordinates]);
        

 


      
         
    
    }


   async function pushCoords(c) {
        for (var i=0; i<c.length; i ++ ) {
            console.log("coords")
            console.log(c[i])
            if(c[i]){
                const newcoord = c[i].features.coordinates;
                setCoordinates(prev => [...prev,newcoord])
            }
        }
    }
    


    async function newMap() {



        console.log("CommunesCoords >>>")
        console.log([CommunesCoords])
        console.log("Coords_results")
        console.log([Coords_results])
        console.log("Coordinates")
        // console.log(Coordinates[0][0])
        console.log("CommunesCoords")
        console.log("CommunesCoords")
        const array = [CommunesCoords];
        // const newarray = array.flat(2);
        console.log("Coords");
        // console.log(JSON.stringify(Coords.flat(3)));
        // console.log(Coords[0].features.coordinates);
   
//     newMap();
// console.log("new map ")
console.log("Coordinatess")
    console.log(Coordinates)
    // console.log(Coordinates.length)

    //     const map1 = new Map(
    //         [Coords].map(object => {
    //           return [object.key , object.value];
    //         }),
    //       );
    //       console.log("map1")
    //       console.log(map1)
          
    //     console.log(Coords.flat(1));


        
   
    
        // const newarray_purged = [newarray[3].coords]
        console.log("newarray");
        // console.log(newarray);
        console.log("newarray_purged");
        // console.log(newarray[3].coords)
       
        const image = new CircleStyle({
            radius: 2,
            fill: null,
            stroke: new Stroke({color: 'green', width: 2}),
          });

          const image2 = new Icon({
                    anchor: [0.5, 0.5],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                    src: '../doublegeste-eau.svg'
                  })

          
          const styles = {
            'Point': new Style({
              image: image,
            }),
            'LineString': new Style({
              stroke: new Stroke({
                color: 'green',
                width: 1,
              }),
            }),
            
            'MultiPoint': new Style({
              image: image2,
            }),
            // 'MultiPolygon': new Style({
            //   stroke: new Stroke({
            //     color: 'yellow',
            //     width: 1,
            //   }),
            //   fill: new Fill({
            //     color: 'rgba(255, 255, 0, 0.1)',
            //   }),
            // }),
            // 'Polygon': new Style({
            //   stroke: new Stroke({
            //     color: 'blue',
            //     lineDash: [4],
            //     width: 3,
            //   }),
            //   fill: new Fill({
            //     color: 'rgba(0, 0, 255, 0.1)',
            //   }),
            // }),
            // 'GeometryCollection': new Style({
            //   stroke: new Stroke({
            //     color: 'magenta',
            //     width: 2,
            //   }),
            //   fill: new Fill({
            //     color: 'magenta',
            //   }),
            //   image: new CircleStyle({
            //     radius: 10,
            //     fill: null,
            //     stroke: new Stroke({
            //       color: 'magenta',
            //     }),
            //   }),
            // }),
            // 'Circle': new Style({
            //   stroke: new Stroke({
            //     color: 'green',
            //     width: 10,
            //   }),
            //   fill: new Fill({
            //     color: 'rgba(255,0,0,0.2)',
            //   }),
            // }),
          };
          
          const styleFunction = function (feature) {
            return styles[feature.getGeometry().getType()];
          };


        //  var ensemble = Coordinates
          const geojsonObject = {
            'type': 'FeatureCollection',
            'crs': {
              'type': 'name',
              'properties': {
                'name': 'EPSG:3857',
              },
            },
            // 'features': Coords.features
            'features': [
            //   {
            //     'type': 'Feature',
            //     'geometry': {
            //       'type': 'Point',
            //       'coordinates': Coordinates[1],
            //     }},
            {
                    'type': 'Feature',
                    'geometry': {
                  'type': 'MultiPoint',
                  'coordinates': Coordinates,
                }},
                {
                    'type': 'Feature',
                    'geometry': {
                  'type': 'MultiPoint',
                  'coordinates': Coordinates,
                }},
                {
                    'type': 'Feature',
                    'geometry': {
                  'type': 'Point',
                  'coordinates': Coordinates[2],
                }},
                {
                    'type': 'Feature',
                    'geometry': {
                  'type': 'Point',
                  'coordinates': Coordinates[24],
                }},

                {
                    'type': 'Feature',
                    'geometry': {
                  'type': 'Point',
                  'coordinates': Coordinates[65],
                }},

                ]

                
            }
            
          const vectorSource = new VectorSource({
            features: new GeoJSON().readFeatures(geojsonObject),
       

          });
          
          vectorSource.addFeature(new Feature(new Circle([5e6, 7e6], 1e6)));
          
          const vectorLayer = new VectorLayer({
            source: vectorSource,
            style: styleFunction,
          });

          

        

        // var mapAlready = false

        // useEffect(() => {
        //     if(!mapAlready){
                const map = new Map({
                    target: 'map3',
        
                    // features: [iconFeature],
                    layers: [
                        new TileLayer({
                            source: new OSM(),
                        }), 
                        vectorLayer , 
                       
        
        
                    ],
        
                  
        
                 
        
        
                    view: new View({
                        center: Coordinates[0],
                        zoom: 7,
                    }),
        
                   
                   
                });

                // setMap(initialMap);
                // mapAlready = true;
            
            //   setMap(initialMap);
            //   mapAlready = true
            // }
      
    
      
        
        //   useEffect(() => {
           
        //       if(map){
           
               
        //         vectorLayer.changed()
                
        //       }
        
              
              
        //   }, [Coordinates]);
              

        // const map = new Map({
        //     target: 'map3',

        //     // features: [iconFeature],
        //     layers: [
        //         new TileLayer({
        //             source: new OSM(),
        //         }), 
        //         vectorLayer , 
               


        //     ],

          

         


        //     view: new View({
        //         center: Coordinates[0],
        //         zoom: 7,
        //     }),

          
           
        // });
        // setMap(map);

    }

   
   





async function changeHandler(event) {


    Papa.parse(event.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: async function (results) {
            const rowsArray = [];
            const Stations_ = [];
            const valuesArray = [];
            const Communes = [];
            const _Coords = [];

            // Iterating data to get column name and their values
            results.data.map((d) => {

                // if (results.data[0].pourcentage_supLQ != 0) {
                rowsArray.push(Object.keys(d));

                valuesArray.push(Object.values(d));

            });

            // Parsed Data Response in array format
            setParsedData(results.data);

            // Filtered Column Names
            setTableRows(rowsArray[0]);
            console.log("valuesArray");
            console.log(valuesArray);

            // Filtered Values
            // var filteredValues = valuesArray.filter(row => row[12] != "0")
            var filteredValues = valuesArray
            for (var i = 0; i < 1000; i++) {
                var curCodeCommune = filteredValues ? (filteredValues[i] ? filteredValues[i][3] : null) : null;
                if (curCodeCommune && !Communes.some(commune => commune.code === curCodeCommune)) {
                 
                    console.log("nouvelle commune")
                    // var coord = await  getStationCoordinates(filteredValues[i][5])
                    var code_commune = curCodeCommune
                    if (code_commune.length === 4) {
                        code_commune = "0"+code_commune;
                        console.log("fixed code_commune")
                        console.log(code_commune)
                    }
                    var coords = await getCoordinatesFromCodeCommune(code_commune)
                    console.log([i])

                    Communes.push({
                        code: [i],
                        // code: filteredValues[i][3],
                        coords: coords,
                        mesure: [filteredValues[i]]
                    })

                    _Coords.push({features: coords })
                }
                else if (curCodeCommune) {

                    var CommuneIndex = Communes.findIndex((obj => obj.code == curCodeCommune));
                    Communes[CommuneIndex].mesure.push(filteredValues[i])
                    console.log("already existing commune")
                    console.log("Communes");
                    // Coords.push({features: coords })
                    // Coords.push({features: coords.features.coordinates[i] })
                    // setCoords( coords.features.coordinates[i])


                    console.log(Communes);
                  
                    
                    // SetCoco(Communes)
                    
                    // SetCoco(Communes[2].coords.coordinates)



                }

             

                setCoordsResults(Coords_results);

                SetCoco([Communes])
                setCoords(_Coords);
                // console.log("new commune")
                // console.log(CommunesCoords)
                // newMap();

            }

            pushCoords(_Coords);
            setValues(filteredValues);
            console.log("completed changeHandler")
        },
    });
    console.log(event.target.files[0])

    //   newMap();
//     function pushCoords() {
//         var i;
//         for (i=0; i<100; i ++ ) {
//             Coordinates.push(Coords[i].features.coordinates)
//         }


//     }
//     pushCoords();
// //     newMap();
// // console.log("new map ")
// console.log("Coordinatess")
//     console.log(Coordinates)


    return Communes;
    

};


    //   newMap();

async function getStationCoordinates(code_station) {
    console.log("requesting coord of: " + code_station)
    const Stations_fetch = await fetch('https://hubeau.eaufrance.fr/api/v2/qualite_rivieres/station_pc?code_station=' + code_station + '&autocomplete=1&pretty');
    const Stations_results = await Stations_fetch.json();
    console.log("Stations_fetch")
    console.log(Stations_results)
    console.log("Stat coordX: ")
    // console.log(Stations_fetch.data[0].coordonnees_x)
    return Stations_results

}

async function getCoordinatesFromCodeCommune(code_commune) {
    //&geometry=contour
    const Coords_fetch = await fetch('https://geo.api.gouv.fr/communes/' + code_commune + '?format=geojson');
    const Coords_results = await Coords_fetch.json();
    console.log("api adresse executed and delivered:")
    console.log(Coords_results);
    return Coords_results.geometry
    console.log(Coords_results.features[0].geometry.coordinates[0])
    console.log(Coords_results.features[0].geometry.coordinates[1])
}







return (
    <div>
        <h1>Mon cours d'eau</h1>

        <input
            type="file"
            name="file"
            accept=".csv"
            onChange={changeHandler}
            style={{ display: "block", margin: "10px auto" }}
        />
        <div onClick={() => console.log(Stations)} >Debug</div>
        <div onClick={newMap} >Generate Map from Coordinates Array</div>
        <div onClick={checklogs} >Check logs</div>


        <br />
        <br />

        <MapGenerator Coordinates={Coordinates}/>
    {/* <div id="map3" className='map3'></div> */}
        <table>
            <thead>
                <tr>
                    {tableRows.map((rows, index) => {
                        return <th key={index}>{rows}</th>;
                    })}
                </tr>
            </thead>
            <tbody>
                {values.map((value, index) => {
                
                    if (index < 9000) {
                        return (
                            <tr key={index}>
                                {value.map((val, i) => {

                                    if (value[i].pourcentage_supLQ != 0) {
                                        return <td key={i}>{val}</td>;
                                    }
                                })}
                                <td >{ }</td>
                            </tr>
                        );
                    }
                })}
            </tbody>
        </table>
       
        <div id="popup"></div>


   


    </div>
);
};

export default Stations;