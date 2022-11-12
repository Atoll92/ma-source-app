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
  const [selectedIndex, setSelectedIndex] = useState([]);


  // const layers = [
  //   new TileLayer({
  //       source: new OSM(),
  //   }),
  //   new VectorLayer({
  //     source: new VectorSource({
  //     features: [new Feature(point)],
  //     }),
  //     style: {
  //     'circle-radius': 9,
  //     'circle-fill-color': 'red',
  //     },
  // })
  // ]

  var mapAlready = false;

  useEffect(() => {
    if(!mapAlready){
      const layers = [
        new TileLayer({
            source: new OSM(),
        }),
      //   new VectorLayer({
      //     source: new VectorSource({
      //     features: [new Feature(point)],
      //     }),
      //     style: {
      //     'circle-radius': 3,
      //     'circle-fill-color': 'red',
      //     },
      // })
      ]

      const initialMap = new Map({
        target: "map",
        layers: layers,
          //  new VectorLayer({
          //     source: new VectorSource({
          //     features: [new Feature(point)],
          //     }),
          //     style: {
          //     'circle-radius': 9,
          //     'circle-fill-color': 'red',
          //     },
          // }),],
        view: view,
        
      });
      setMap(initialMap);
      mapAlready = true
    }
  }, []);

  // const iconFeature = new Feature({
  //   geometry: new Point(fromLonLat([X, Y])),
  //   name: 'Somewhere near Nottingham',
  // });

  useEffect(() => {
   
      if(map){
        const view = map.getView();
        view.setCenter([X,Y]);
        view.setZoom(9)
        map.addLayer(new VectorLayer({
          source: new VectorSource({
          features: [new Feature(point)],
          }),
          style: {
          'circle-radius': 9,
          'circle-fill-color': 'red',
          },
      }))
      
        
        //  new VectorSource.addFeatures(point);
         console.log("point : " + point);

        console.log(map.getView())
        console.log("Y:")
        console.log(Y)

        
        
        

      

        
      }

      
      
  }, [X,Y]);

  const place = [X, Y];

  const point = new Point(place);


  const layers = [
    new TileLayer({
        source: new OSM(),
    }),
    new VectorLayer({
      source: new VectorSource({
      features: [new Feature(point)],
      }),
      style: {
      'circle-radius': 9,
      'circle-fill-color': 'red',
      },
  })
  ]
  const view = new View({
      center: [2, 47],
      // projection: 'EPSG:4326',
      zoom: 5.2,
  })

  var mapAlready = false



  
  
  // new VectorSource({
  //   source: new VectorSource({
  //     features: [iconFeature]
  //   }),
  //   style: new Style({
  //     image: new Icon({
  //       anchor: [0.5, 46],
  //       anchorXUnits: 'fraction',
  //       anchorYUnits: 'pixels',
  //       src: 'https://openlayers.org/en/latest/examples/data/icon.png'
  //     })
  //   })
  // })

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
        console.log("citycode")
        console.log(geo_result.features[0].properties.citycode)
        var code_commune = (geo_result.features[0].properties.citycode)
        const UDIs = await fetch('https://hubeau.eaufrance.fr/api//vbeta/qualite_eau_potable/communes_udi?code_commune=' + code_commune + '&autocomplete=1&pretty');
        const UDI_List = await UDIs.json();
        console.log(UDI_List)
        setUDI_List(UDI_List.data)
        setX(geo_result.features[0].geometry.coordinates[0])
        setY(geo_result.features[0].geometry.coordinates[1])
        getCoordinatesCoursdeau(geo_result);
       // curl "https://api-adresse.data.gouv.fr/search/?q=8+bd+du+port"
    }
    async function getCoordinatesCoursdeau(geo_result){
      
      // console.log(adresse)
      const coursdeau_result = await fetch('https://hubeau.eaufrance.fr/api/v2/qualite_rivieres/station_pc?code_commune=' + geo_result.features[0].properties.citycode + '&pretty');
      const coursdeau = await coursdeau_result.json();
      console.log("coursdeau");
      console.log(coursdeau.data[0].code_cours_eau);
      var coursdeauvar = coursdeau.data[0].code_cours_eau
      const coursdeau_geo = await fetch('https://services.sandre.eaufrance.fr/geo/sandre?SERVICE=WFS&amp;REQUEST=getFeature&amp;VERSION=2.0.0&amp;TYPENAME=CoursEau_Topage2019&amp;OUTPUTFORMAT=application/json%3B%20subtype%3Dgeojson&amp;FILTER=%3CFilter%3E%3CPropertyIsEqualTo%3E%3CPropertyName%3ECdOH%3C/PropertyName%3E%3CLiteral%3E' + coursdeauvar + '%3C/Literal%3E%3C/PropertyIsEqualTo%3E%3C/Filter%3E');
      // const coursdeau_geojson = await coursdeau_geo.json();
      const coursdeaux = await coursdeau_geo.json();
    
      console.log("coursdeau_geojson")
      console.log(coursdeau_geo);
      console.log(coursdeaux);
    
      // console.log(geo_result.features[0].geometry.coordinates[0])
      // console.log(geo_result.features[0].geometry.coordinates[1])
      // console.log("citycode")
      // console.log(geo_result.features[0].properties.citycode)
      // console.log(geo_result.features[0].properties.citycode)
      // var code_commune = (geo_result.features[0].properties.citycode)
      // const UDIs = await fetch('https://hubeau.eaufrance.fr/api//vbeta/qualite_eau_potable/communes_udi?code_commune=' + code_commune + '&autocomplete=1&pretty');
      // const UDI_List = await UDIs.json();
      // console.log(UDI_List)
      // setUDI_List(UDI_List.data)
      // setX(geo_result.features[0].geometry.coordinates[0])
      // setY(geo_result.features[0].geometry.coordinates[1])
     // curl "https://api-adresse.data.gouv.fr/search/?q=8+bd+du+port"
  }
    async function display_results(code_reseau, index) {

      setQuali("Chargement...")
      const reseau_results = await fetch('https://hubeau.eaufrance.fr/api//vbeta/qualite_eau_potable/resultats_dis?code_reseau=' + code_reseau + '&autocomplete=1&pretty');
      const resultats = await reseau_results.json();
      console.log(resultats.data[0].conclusion_conformite_prelevement)

      setQuali(resultats.data[0].conclusion_conformite_prelevement)
      console.log(resultats.data[0])
      // document.getElementById("map").style.display = "block";

      // setSelectedIndex(i);

      const handleClick = (index) => () => {
        setSelectedIndex(state => ({
          ...state, // <-- copy previous state
          [index]: !state[index] // <-- update value by index key
        }));
      };

      handleClick();


    }
  return (
    <div>
    <h1>Mon eau potable</h1>
    <input id="adresse" type="text" onChange={autofillAdress} ></input>
    <button >Trouver la source</button>
    <p>{quali}</p>
    <p>
      {UDI.map((udi, i) =>
      <span  style={{height:'350px',width:'350px'}}  key={i} onClick={() => display_results(udi.code_reseau)}> quartier: {udi.nom_quartier} réseau: {udi.nom_reseau} code réseau:{udi.code_reseau} String()<br/></span>  )}
    </p>

    
    <div style={{height:'350px',width:'350px'}} className="map-container" id="map" />
 

    </div>

   

  )
}
