import React, { useState, useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { useGeographic } from "ol/proj";
import OSM from "ol/source/OSM";
import "ol/ol.css";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import Stroke from "ol/style/Stroke";
import GeoJSON from "ol/format/GeoJSON";
import VectorSource from "ol/source/Vector";
import { Icon, Style } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import LineString from "ol/geom/LineString";
import { json } from "react-router-dom";

export default function Adresse() {
  useGeographic();

  const [map, setMap] = useState();
  const [X, setX] = useState(0);
  const [Y, setY] = useState(0);
  const [UDI, setUDI_List] = useState([]);
  const [quali, setQuali] = useState("");
  const [selectedIndex, setSelectedIndex] = useState([]);
  const [RiverCoordinates, setRiverCoordinates] = useState([]);

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
    if (!mapAlready) {
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
      ];

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
      mapAlready = true;
    }
  }, []);

  // const iconFeature = new Feature({
  //   geometry: new Point(fromLonLat([X, Y])),
  //   name: 'Somewhere near Nottingham',
  // });

  const place = [X, Y];

  const point = new Point(place);

	useEffect(() => {
		if (map) {
			const view = map.getView();
			view.setCenter([X, Y]);
			view.setZoom(9);
			map.addLayer(
				new VectorLayer({
					source: new VectorSource({
						features: [new Feature(point)],
					}),
					style: {
						"circle-radius": 9,
						"circle-fill-color": "red",
					},
				})
			);
			// console.log("point : " + point);
			// console.log(map.getView());
			// console.log("Y:");
			// console.log(Y);
		}
	}, [X, Y]);
  //   useEffect(() => {

  //     updateRiverMap();

  // }, [RiverCoordinates]);

  //   useEffect(() => {
  //     const river = new LineString([RiverCoordinates[0].coordinates], "Linestring")
  //     if(map){
  //       // const view = map.getView();
  //       // view.setCenter([X,Y]);
  //       // view.setZoom(9)

  //     }

  // }, [RiverCoordinates]);

  const layers = [
    new TileLayer({
      source: new OSM(),
    }),
    new VectorLayer({
      source: new VectorSource({
        features: [new Feature(point)],
      }),
      style: {
        "circle-radius": 9,
        "circle-fill-color": "red",
      },
    }),
  ];
  const view = new View({
    center: [2, 47],
    // projection: 'EPSG:4326',
    zoom: 5.2,
  });

  	var mapAlready = false;
//test branch
	async function autofillAdress(event) {
		if(event.target.value.length <= 3){
			return;
		}
		
		const GeoJson = await getGeoJsonFromAdress(event.target.value);
		if(GeoJson.features.length === 0){
			console.log("Warning: no geojson found for adress " + event.target.value + " so returning early");
			return;
		}
		setX(GeoJson.features[0].geometry.coordinates[0]);
		setY(GeoJson.features[0].geometry.coordinates[1]);
		const UDI_List = await getUDIsFromCodeCommune(GeoJson.features[0].properties.citycode);
		setUDI_List(UDI_List);
		const station_pc = await getStationPCFromCodeCommune(GeoJson.features[0].properties.citycode);
		if(station_pc.length === 0){
			console.log("Warning: no station_pc found for code commune " + GeoJson.features[0].properties.citycode + " so returning early");
			return;
		}
		const cours_geo_json = await getCoursGeoJson(station_pc[0].code_cours_eau);
		setRiverCoordinates(cours_geo_json.features[0].geometry);
	}

	async function getGeoJsonFromAdress(adresse) {
		console.log("getGeoJsonFromAdress called for adresse " + adresse);
		const adresse_query = await fetch("https://api-adresse.data.gouv.fr/search/?q=" + adresse + "&autocomplete=1&pretty");
		const adresse_result = await adresse_query.json();
		console.log("getGeoJsonFromAdress returned : ")
		console.log(adresse_result)
		return adresse_result;
	}

	async function getUDIsFromCodeCommune(code_commune){
		console.log("getUDIsFromCodeCommune called for code_commune " + code_commune);
		const UDIs = await fetch(
		"https://hubeau.eaufrance.fr/api/v1/qualite_eau_potable/communes_udi?code_commune=" +
			code_commune +
			"&autocomplete=1&pretty"
		);
		const UDI_List = await UDIs.json();
		console.log("getUDIsFromCodeCommune got : ")
		console.log(UDI_List);
		console.log("(we only return the data member)")
		return UDI_List.data;
	}

	async function getStationPCFromCodeCommune(code_commune) {
		console.log("getStationPCFromCodeCommune paramters (code_commune) :")
		console.log(code_commune)
		const station_pc_result = await fetch("https://hubeau.eaufrance.fr/api/v2/qualite_rivieres/station_pc?code_commune=" + code_commune + "&pretty");
		const station_pc = await station_pc_result.json();
		console.log("station_pc at the end of getStationPCFromCodeCommune (we return only .data member) :");
		console.log(station_pc);
		return station_pc.data;
	}

	async function getCoursGeoJson(code_cours_deau) {
		console.log("getCoursGeoJson calld with param code_cours_deau :");
		console.log(code_cours_deau);
		if(!code_cours_deau){
			console.log("error : code_cours_deau is " + code_cours_deau);
			return;
		}
		var URL =
		"https://services.sandre.eaufrance.fr/geo/sandre?SERVICE=WFS&REQUEST=getFeature&VERSION=2.0.0&TYPENAME=CoursEau_Carthage2017&OUTPUTFORMAT=application/json%3B%20subtype%3Dgeojson&FILTER=%3CFilter%3E%3CPropertyIsEqualTo%3E%3CPropertyName%3ECdEntiteHydrographique%3C/PropertyName%3E%3CLiteral%3E" +
		code_cours_deau +
		"%3C/Literal%3E%3C/PropertyIsEqualTo%3E%3C/Filter%3E";
		const res = await fetch(URL);
		const cours_geo_json = await res.json();
		console.log("getCoursGeoJson got cours_geo_json :");
		console.log(cours_geo_json);
		return cours_geo_json;
	}

	useEffect(() => {
		if (map) {

			console.log("RiverCoordinates changed, so lets add it to the map")
			console.log(RiverCoordinates)

			const OLFormatted_LineString = new LineString(RiverCoordinates.coordinates);
			console.log("OLFormatted_LineString :");
			console.log(OLFormatted_LineString);

			map.addLayer(
				new VectorLayer({
					source: new VectorSource({
						features: [new Feature(OLFormatted_LineString)],
					}),
					style: new Style({
						stroke: new Stroke({
						  color: 'rgba(0, 205, 0, 1)', //finished line
						  width: 4,
						}),
					}),
				})
			);
			// console.log("point : " + point);
			// console.log(map.getView());
			// console.log("Y:");
			// console.log(Y);
		}
	}, [RiverCoordinates]);

	async function display_results(code_reseau, index) {
		setQuali("Chargement...");
		const reseau_results = await fetch(
		"https://hubeau.eaufrance.fr/api/v1/qualite_eau_potable/resultats_dis?code_reseau=" +
			code_reseau +
			"&autocomplete=1&pretty"
		);
		const resultats = await reseau_results.json();
		console.log(resultats.data[0].conclusion_conformite_prelevement);

		setQuali(resultats.data[0].conclusion_conformite_prelevement);
		console.log(resultats.data[0]);
		// document.getElementById("map").style.display = "block";

		// setSelectedIndex(i);

		const handleClick = (index) => () => {
		setSelectedIndex((state) => ({
			...state, // <-- copy previous state
			[index]: !state[index], // <-- update value by index key
		}));
		};

		handleClick();
	}

	function updateRiverMap() {
		const river = new LineString(RiverCoordinates[0].coordinates);
		console.log("river :");
		console.log(river);

		const geojsonRiver = {
			type: "FeatureCollection",
			crs: {
				type: "name",
				properties: {
					name: "EPSG:3857",
				},
			},
			features: [
			{
				type: "Feature",
				geometry: {
					type: "LineString",
					coordinates: [RiverCoordinates[0].coordinates],
				},
			},
			],
		};

		const vectorSourceRiver = new VectorSource({
			features: new GeoJSON().readFeatures(geojsonRiver),
		});

		const styles = {
			LineString: new Style({
			stroke: new Stroke({
				color: "black",
				width: 100,
			}),
			}),
		};

		const styleFunction = function (feature) {
			return styles[feature.getGeometry().getType()];
		};

		const vectorLayerRiver = new VectorLayer({
			source: vectorSourceRiver,
			style: styleFunction,
		});

		// const map = new Map({
		// 	target: "map",

		// 	// features: [iconFeature],
		// 	layers: [
		// 	new TileLayer({
		// 		source: new OSM(),
		// 	}),
		// 	vectorLayerRiver,
		// 	],
		// 	view: new View({
		// 	center: [X, Y],
		// 	zoom: 7,
		// 	}),
		// });

		map.addLayer(vectorLayerRiver)
		console.log("river drawn");
		console.log(geojsonRiver);

		// }),)
	}

  return (
    <div>
      <h1>Mon eau potable</h1>
      <input id="adresse" type="text" onChange={autofillAdress}></input>
      {/* <div onClick={() => getCoursGeoJson("V4330500")}>Json Cours d eau</div> */}
      <div onClick={updateRiverMap}>Update River</div>
      <p>{quali}</p>
      <p>
        {UDI.map((udi, i) => (
          <span
            style={{ height: "350px", width: "350px" }}
            key={i}
            onClick={() => display_results(udi.code_reseau)}
          >
            {" "}
            quartier: {udi.nom_quartier} réseau: {udi.nom_reseau} code réseau:
            {udi.code_reseau} String()
            <br />
          </span>
        ))}
      </p>

      <div
        style={{ height: "350px", width: "350px" }}
        className="map-container"
        id="map"
      />
      {/* <div style={{height:'350px',width:'350px'}} className="map-container" id="map4" /> */}
    </div>
  );
}
