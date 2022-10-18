import React, { useState, useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { useGeographic } from 'ol/proj';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';
import Point from 'ol/geom/Point';
import {fromLonLat} from 'ol/proj';
import Feature from 'ol/Feature';
import VectorSource from 'ol/source/Vector';
import {Icon, Style} from 'ol/style';
import VectorLayer from 'ol/layer/Vector';


export default function Adresse() {

  useGeographic();

  const [map, setMap] = useState();
  const [X, setX] = useState(0);
  const [Y, setY] = useState(0);
  const [UDI, setUDI_List] = useState([]);
  const [quali, setQuali] = useState("");

  const layers = [
    new TileLayer({
        source: new OSM(),
    }),
  ]
  const view = new View({
      center: [-5, 43],
      // projection: 'EPSG:4326',
      zoom: 0,
  })

  var mapAlready = false

  useEffect(() => {
    if(!mapAlready){
      const initialMap = new Map({
        target: "map",
        layers: layers,
        view: view,
      });
      setMap(initialMap);
      mapAlready = true
    }
  }, []);

  const iconFeature = new Feature({
    geometry: new Point(fromLonLat([X, Y])),
    name: 'Somewhere near Nottingham',
  });

  useEffect(() => {
   
      if(map){
        const view = map.getView();
        view.setCenter([X,Y]);

        console.log(map.getView())
        console.log("Y:")
        console.log(Y)

       

        new VectorSource({
          source: new VectorSource({
            features: [iconFeature]
          }),
          style: new Style({
            image: new Icon({
              anchor: [0.5, 46],
              anchorXUnits: 'fraction',
              anchorYUnits: 'pixels',
              src: 'https://openlayers.org/en/latest/examples/data/icon.png'
            })
          })
        })
      }

      
      
  }, [X,Y]);


    async function autofillAdress(event) {
        getCoordinates(event.target.value);
    }
  

    async function getCoordinates(adresse){
      
        console.log(adresse)
        const adresse_result = await fetch('https://api-adresse.data.gouv.fr/search/?q=' + adresse + '&autocomplete=1&pretty');
        const geo_result = await adresse_result.json();
        console.log(geo_result);
        console.log(geo_result.features[0].geometry.coordinates[0])
        console.log(geo_result.features[0].geometry.coordinates[1])
        console.log(geo_result.features[0].properties.citycode)
        var code_commune = (geo_result.features[0].properties.citycode)
        const UDIs = await fetch('https://hubeau.eaufrance.fr/api//vbeta/qualite_eau_potable/communes_udi?code_commune=' + code_commune + '&autocomplete=1&pretty');
        const UDI_List = await UDIs.json();
        console.log(UDI_List)
        setUDI_List(UDI_List.data)
        setX(geo_result.features[0].geometry.coordinates[0])
        setY(geo_result.features[0].geometry.coordinates[1])
       // curl "https://api-adresse.data.gouv.fr/search/?q=8+bd+du+port"
    }

    async function display_results(code_reseau) {

      setQuali("Chargement...")
      const reseau_results = await fetch('https://hubeau.eaufrance.fr/api//vbeta/qualite_eau_potable/resultats_dis?code_reseau=' + code_reseau + '&autocomplete=1&pretty');
      const resultats = await reseau_results.json();
      console.log(resultats.data[0].conclusion_conformite_prelevement)

      setQuali(resultats.data[0].conclusion_conformite_prelevement)
      console.log(resultats.data[0])


    }
  return (
    <span>
    <h1>Mon adresse</h1>
    <input id="adresse" type="text" onChange={autofillAdress} ></input>
    <button >Trouver la source</button>
    <p>
      {/* {UDI.map((udi, i) =>
      <span key={i} onClick={() => display_results(udi.code_reseau)}> quartier: {udi.nom_quartier} réseau: {udi.nom_reseau} code réseau:{udi.code_reseau}<br/></span>  )} */}
    </p>

    <p>{quali}</p>
    <div style={{height:'100vh',width:'100%'}} className="map-container" id="map" />
 

    </span>

   

  )
}
