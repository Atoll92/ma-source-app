import React from 'react';
import Papa from 'papaparse';
import { useState } from 'react';
import { Feature, Map, View } from 'ol';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import { Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import LineString from 'ol/geom/LineString';

const MapGenerationFuture = () => {

    //State to store csv raw data
    const [tableRows, setTableRows] = useState([]);
    const [values, setValues] = useState([]);
    const [Stations, setStations] = useState([]);
    const [CoursDeau, setCoursDeau] = useState([]);
	const [map, setMap] = useState();
	
	var mapAlready = false;
	React.useEffect(() => {
		if (!mapAlready) {
		  const layers = [
			new TileLayer({
			  source: new OSM(),
			})
		  ];
		  const view = new View({
			center: [2, 47],
			zoom: 5.2,
		  });
		  const initialMap = new Map({
			target: "mapGF",
			layers: layers,
			view: view,
		  });
		  setMap(initialMap);
		  mapAlready = true;
		}
	}, []);

    async function changeHandler(event) {
        Papa.parse(event.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: async function (results) {
                // const Stations_ = [];
                // const Communes = [];
                // const _Coords = [];

				FillValuesAndRows(results.data);
                
                // // Parsed Data Response in array format
                // setParsedData(results.data);

                // Filtered Column Names
                // setTableRows(rowsArray[0]);
                // console.log("valuesArray");
                // console.log(valuesArray);

                // Filtered Values
                // var filteredValues = valuesArray.filter(row => row[12] != "0")
                // var filteredValues = valuesArray
                // for (var i = 0; i < 10000; i++) {
                //     var curCodeCommune = filteredValues ? (filteredValues[i] ? filteredValues[i][3] : null) : null;
                //     if (curCodeCommune && !Communes.some(commune => commune.code === curCodeCommune)) {
                    
                //         console.log("nouvelle commune")
                //         // var coord = await  getStationCoordinates(filteredValues[i][5])
                //         var code_commune = curCodeCommune
                //         if (code_commune.length === 4) {
                //             code_commune = "0"+code_commune;
                //             console.log("fixed code_commune")
                //             console.log(code_commune)
                //         }
                //         var coords = await getCoordinatesFromCodeCommune(code_commune)
                //         console.log([i])

                //         Communes.push({
                //             code: [i],
                //             // code: filteredValues[i][3],
                //             coords: coords,
                //             mesure: [filteredValues[i]]
                //         })

                //         _Coords.push({features: coords })
                //     }
                //     else if (curCodeCommune) {

                //         var CommuneIndex = Communes.findIndex((obj => obj.code == curCodeCommune));
                //         Communes[CommuneIndex].mesure.push(filteredValues[i])
                //         console.log("already existing commune")
                //         console.log("Communes");
                //         // Coords.push({features: coords })
                //         // Coords.push({features: coords.features.coordinates[i] })
                //         // setCoords( coords.features.coordinates[i])


                //         console.log(Communes);
                    
                        
                //         // SetCoco(Communes)
                        
                //         // SetCoco(Communes[2].coords.coordinates)



                //     }

                

                //     setCoordsResults(Coords_results);

                //     SetCoco([Communes])
                //     setCoords(_Coords);
                //     // console.log("new commune")
                //     // console.log(CommunesCoords)
                //     // newMap();

                // }

                // pushCoords(_Coords);
                // console.log("completed changeHandler")
            },
        });
        //console.log(event.target.files[0])

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


        //return Communes;
        

    };

	// fill our states with data returned by papa parse
	function FillValuesAndRows(data){
		const valuesArray = [];
		for(var i=0;i<data.length;i++){
			
			// filter values according to whatever
			// if (results.data[0].pourcentage_supLQ != 0) {
			valuesArray.push(Object.values(data[i]));
		}

		setTableRows(Object.keys(data[0]));
		setValues(valuesArray);
	}

	// useEffect triggers on new values, from a new csv.
	React.useEffect(()=>{
		aggregateStations(values);
	},[values]);

	// fill our stations state with station object with correct code
	function aggregateStations(raw_data){
		const Stations_ = [];
		for(var i=0;i<raw_data.length;i++){
			const curCodeStation = raw_data[i][5].length === 8 ? raw_data[i][5] : '0' + raw_data[i][5];
			if(!Stations_.some(station => station.code === curCodeStation)){
				Stations_.push({code:curCodeStation})
			}
		}
		console.log("aggregateStations finished with :")
		console.log(Stations_);
		setStations(Stations_);
	}

	// useEffect triggers on new Stations
	React.useEffect(()=>{
		aggregateCoursDeau(Stations).then((CoursDeau_)=>{
			Promise.all(CoursDeau_.map(getCoursDeauGeoJson)).then((CoursDeau__)=>{
				setCoursDeau(CoursDeau__);
				console.log("CoursDeau__");
				console.log(CoursDeau__);
			});
		});
	},[Stations]);

	// fill our cours d'eau state with an aggregate of code cours d'eau
	async function aggregateCoursDeau(stations){
		const CoursDeau_ = [];
		for(var i=0;i<stations.length;i++){
			const station_data = await getStationPCFromCodeStation(stations[i].code)
			if(station_data.length >= 1 && station_data[0].code_cours_eau)
			{
				const code_cours_deau = station_data[0].code_cours_eau
				if(!CoursDeau_.some(c => c.code === code_cours_deau)){
					CoursDeau_.push({code:code_cours_deau})
				}
			}
		}
		console.log("aggregateCoursDeau finished with :")
		console.log(CoursDeau_);
		return CoursDeau_;
	}

	async function getStationPCFromCodeStation(code_station) {
		console.log("getStationPCFromCodeStation paramters (code_station) :")
		console.log(code_station)
		const station_pc_result = await fetch("https://hubeau.eaufrance.fr/api/v2/qualite_rivieres/station_pc?code_station=" + code_station + "&pretty"); //TODO, we can call api with up to 200 code station at a time so we should definetely do that
		const station_pc = await station_pc_result.json();
		console.log("station_pc.data at the end of getStationPCFromCodeCommune :");
		console.log(station_pc.data);
		return station_pc.data;
	}

	async function getCoursDeauGeoJson(cours_deau){
		console.log("getCoursDeauGeoJson calld with param code_cours_deau :");
		console.log(cours_deau.code);
		if(!cours_deau.code){
			console.log("error : code_cours_deau is " + cours_deau.code);
			return;
		}
		var URL = "https://services.sandre.eaufrance.fr/geo/sandre?SERVICE=WFS&REQUEST=getFeature&VERSION=2.0.0&TYPENAME=CoursEau_Carthage2017&OUTPUTFORMAT=application/json%3B%20subtype%3Dgeojson&FILTER=%3CFilter%3E%3CPropertyIsEqualTo%3E%3CPropertyName%3ECdEntiteHydrographique%3C/PropertyName%3E%3CLiteral%3E" + cours_deau.code + "%3C/Literal%3E%3C/PropertyIsEqualTo%3E%3C/Filter%3E";
		const res = await fetch(URL);
		const cours_geo_json = await res.json();
		console.log("getCoursDeauGeoJson got cours_geo_json :");
		console.log(cours_geo_json);
		cours_deau.geoJson = cours_geo_json;
		return cours_deau;
	}

	React.useEffect(()=>{
		if (map) {

			console.log("CoursDeau changed, so lets add it to the map")
			console.log(CoursDeau)

			const features = [];
			
			for(var i=0;i<CoursDeau.length;i++){
				if(CoursDeau[i].geoJson.features[0] && CoursDeau[i].geoJson.features[0].geometry && CoursDeau[i].geoJson.features[0].geometry.type === "LineString"){
					const OLFormatted_LineString = new LineString(CoursDeau[i].geoJson.features[0].geometry.coordinates);
					console.log("OLFormatted_LineString :");
					console.log(OLFormatted_LineString);

					features.push(new Feature(OLFormatted_LineString)) 
				} else {
					console.log("Warning, following cours d'eau doesnt have a feature in its geoJson or not a LineString")
					console.log(CoursDeau[i])
				}
			}

			console.log("features")
			console.log(features)


			map.addLayer(
				new VectorLayer({
					source: new VectorSource({
						features: features,
					}),
					style: new Style({
						stroke: new Stroke({
						  color: 'rgba(255, 0, 0, 1)', //finished line
						  width: 1,
						}),
					}),
				})
			);
		}
	},[CoursDeau]);

return (
    <div>
        <h1>MapGenerationFuture</h1>

        <input
            type="file"
            name="file"
            accept=".csv"
            onChange={changeHandler}
            style={{ display: "block", margin: "10px auto" }}
        />

        <div id="mapGF" className='map-container'></div>
        {/* <table>
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
        </table> */}
    </div>
);
};

export default MapGenerationFuture;