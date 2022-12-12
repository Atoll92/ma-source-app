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
import Point from 'ol/geom/Point';
import { Circle, Fill } from 'ol/style';
import Legende from './Legende';
import Loading from './Loading';
import logoGN from './Logo-generations-futures.png'
import logoDG from './double_geste.png'

const MapGenerationFuture = () => {

    //State to store csv raw data
    const [tableRows, setTableRows] = useState([]);
    const [values, setValues] = useState([]);
    const [Stations, setStations] = useState([]);
    const [CoursDeau, setCoursDeau] = useState([]);
	const [map, setMap] = useState(null);
	const [substance, setSubstance] = useState("");
	const [loadingStatus, setloadingStatus] = useState(false);
	const [features, setFeatures] = useState([]);

	const SubstanceButton = (props) => {
		return(<button style={{
			backgroundColor: props.sub === substance ? 'salmon' : '',
			color: props.sub === substance ? 'white' : '',
		  }} 
		  onClick={() => setSubstance(props.sub)}>{props.sub}</button>)
	}
	
	// create map and init cours d'eau
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

    async function LoadCSVFile(event) {
		setloadingStatus(true);
        Papa.parse(event.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: async function (results) {
				FillValuesAndRows(results.data);
            },
        });
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
		if(values.length > 0){
			const aggregatedStations = aggregateStations(values);
			const enrichedStations = addCSVDataToStations(aggregatedStations);
			getStationsData(enrichedStations).then(Stations_ => {
				setStations(Stations_);
				aggregateCoursDeau(Stations_).then(CoursDeau_ => {
					const allCoursDeauGeoJson = CoursDeau_.map(CoursDeau_i => getCoursDeauGeoJson(CoursDeau_i))
					Promise.all(allCoursDeauGeoJson).then(allCoursDeauGeoJsonResolved => setCoursDeau(allCoursDeauGeoJsonResolved))
				})
			})
		}
	},[values]);

	// fill our stations state with station object with correct code
	function aggregateStations(raw_data){
		const Stations_ = [];
		for(var i=0;i<raw_data.length;i++){
			const curCodeStation = raw_data[i][5].length === 8 ? raw_data[i][5] : '0' + raw_data[i][5];
			if(!Stations_.some(station => station.code === curCodeStation)){
				//const station_data = await getStationPCFromCodeStation(curCodeStation)
				Stations_.push({code:curCodeStation})
			}
		}
		console.log("aggregateStations finished with :")
		console.log(Stations_);
		return Stations_;
	}

	function addCSVDataToStations(Stations_){
		for(var i=0;i<Stations_.length;i++){

			const csvLines = [];
			for(var j=0;j<values.length;j++){
				const curCodeStation = values[j][5].length === 8 ? values[j][5] : '0' + values[j][5];
				if(curCodeStation === Stations_[i].code){
					csvLines.push(values[j])
				}
			}

			Stations_[i].csvLines = csvLines;
		}
		console.log("addCSVDataToStations finished with :")
		console.log(Stations_);
		return Stations_;
	}

	async function getStationsData(Stations_){
		console.log("calling getStationsData with Stations_:")
		console.log(Stations_)
		for(var ii=0;ii<Stations_.length;ii+=200){
			const code_station_batch = [];
			for(var j=0;j<200 && ii+j<Stations_.length;j++){
				code_station_batch.push(Stations_[ii+j].code)
			}
			const station_data_batch = await getStationPCFromCodeStationBatched(code_station_batch)
			for(var jj=0;jj<200 && ii+jj<Stations_.length;jj++){
				Stations_[ii+jj].station_data = [station_data_batch.find(station_data => station_data.code_station === Stations_[ii+jj].code)]
			}
		}
		return Stations_;
	}

	// useEffect triggers on new Stations of substance to draw them
	React.useEffect(()=>{
		//draw points for each station
		if(Stations.length>0){
			setloadingStatus(true);
			drawStationsLayer(Stations).then(() => setloadingStatus(false));
		}
	},[Stations,substance]);

	async function drawStationsLayer(stations){
		if (map) {

			const features = [];

			for(var i=0;i<stations.length;i++){

				console.log(stations[i]);

				if(stations[i].station_data[0] && stations[i].station_data[0]){
					const OLFormatted_Point = new Point([stations[i].station_data[0].longitude,stations[i].station_data[0].latitude]);
					const OLFeature = new Feature(OLFormatted_Point)

					if(substance){
						var color = "slategrey";
					}

					if (substance === "Carbamazepine") {
					if(stations[i].csvLines.some(line => line[0] === "Carbamazepine")){
						if(stations[i].csvLines.some(line => line[0] === "Carbamazepine" && parseFloat(line[8]) >= 0.05)){
							color = "red";
						} else{
							color = "green";
						}
					}
					}

					if (substance === "Ibuprofène") {
					if(stations[i].csvLines.some(line => line[0] === "Ibuprofène")){
						if(stations[i].csvLines.some(line => line[0] === "Ibuprofène" && parseFloat(line[8]) >= 0.22)){
							color = "red";
						} else{
							color = "green";
						}
					}
					}
					// Erythromycine
					if (substance === "Erythromycine") {
					if(stations[i].csvLines.some(line => line[0] === "Erythromycine")){
						if(stations[i].csvLines.some(line => line[0] === "Erythromycine" && parseFloat(line[8]) >= 0.5)){
							color = "red";
						} else{
							color = "green";
						}
					}
				}
				//17 beta-Estradiol
				if (substance === "17 beta-Estradiol") {
					if(stations[i].csvLines.some(line => line[0] === "17 beta-Estradiol")){
						if(stations[i].csvLines.some(line => line[0] === "17 beta-Estradiol" && parseFloat(line[8]) >= 0.00018)){
							color = "red";
						} else{
							color = "green";
						}
					}
				}

					// Azithromycine
					if (substance === "Azithromycine") {
					if(stations[i].csvLines.some(line => line[0] === "Azithromycine")){
						if(stations[i].csvLines.some(line => line[0] === "Azithromycine" && parseFloat(line[8]) >= 0.019)){
							color = "red";
						} else{
							color = "green";
						}
					}
				}
						// Clarythromycine

						if (substance === "Clarythromycine") {
						if(stations[i].csvLines.some(line => line[0] === "Clarythromycine")){
							if(stations[i].csvLines.some(line => line[0] === "Clarythromycine" && parseFloat(line[8]) >= 0.13)){
								color = "red";
							} else{
								color = "green";
							}
						}
					}

						//Diclofenac

						if (substance === "Diclofenac") {
						if(stations[i].csvLines.some(line => line[0] === "Diclofenac")){
							if(stations[i].csvLines.some(line => line[0] === "Diclofenac" && parseFloat(line[8]) >= 0.04)){
								color = "red";
							} else{
								color = "green";
							}
						}
					}

					if (substance === "Estrone") {
						if(stations[i].csvLines.some(line => line[0] === "Estrone")){
							if(stations[i].csvLines.some(line => line[0] === "Estrone" && parseFloat(line[8]) >= 0.00036)){
								color = "red";
							} else{
								color = "green";
							}
						}
					}

					//Norethindrone

					if (substance === "Norethindrone") {
						if(stations[i].csvLines.some(line => line[0] === "Norethindrone")){
							if(stations[i].csvLines.some(line => line[0] === "Norethindrone" && parseFloat(line[8]) >= 0.04)){
								color = "red";
							} else{
								color = "green";
							}
						}
					}

					// Ofloxacine

					if (substance === "Ofloxacine") {
						if(stations[i].csvLines.some(line => line[0] === "Ofloxacine")){
							if(stations[i].csvLines.some(line => line[0] === "Ofloxacine" && parseFloat(line[8]) >= 0.11)){
								color = "red";
							} else{
								color = "green";
							}
						}
					}


						// var color= colorize(color)

					const Station_style = new Style({
						image : new Circle({
							radius : 4,
							fill: new Fill({
								color : color
							})
						})
					})
					

					OLFeature.setStyle(Station_style)
					// console.log("OLFormatted_Point :");
					// console.log(OLFormatted_Point);

					features.push(OLFeature) 

				} else {
					console.log("Warning, error no station_data[0] in this station : ")
					console.log(stations[i])
				}
			}

			console.log(features);
			map.addLayer(
				new VectorLayer({
					source: new VectorSource({
						features: features,
					})
				})
			);

			//document.getElementById("main_anim").style.display = "none";

		}


	}

	// fill our cours d'eau state with an aggregate of code cours d'eau
	async function aggregateCoursDeau(stations){
		const CoursDeau_ = [];
		for(var i=0;i<stations.length;i++){
			const station_data = stations[i].station_data;
			if(station_data.length >= 1 && station_data[0] && station_data[0].code_cours_eau)
			{
				const code_cours_deau = station_data[0].code_cours_eau
				if(!CoursDeau_.some(c => c.code === code_cours_deau)){
					CoursDeau_.push({code:code_cours_deau,linked_stations:[stations[i]]})
				} else {
					const cdindex = CoursDeau_.findIndex((c => c.code === code_cours_deau))
					CoursDeau_[cdindex].linked_stations.push(stations[i])
				}
			}
		}
		console.log("aggregateCoursDeau finished with :")
		console.log(CoursDeau_);
		return CoursDeau_;
	}

	async function getStationPCFromCodeStationBatched(code_station_batch) {
		// console.log("getStationPCFromCodeStationBatched paramters (code_station) :")
		// console.log(code_station_batch)
		const station_pc_result = await fetch("https://hubeau.eaufrance.fr/api/v2/qualite_rivieres/station_pc?code_station=" + code_station_batch.join(',') + "&pretty"); //TODO, we can call api with up to 200 code station at a time so we should definetely do that
		const station_pc = await station_pc_result.json();
		// console.log("station_pc.data at the end of getStationPCFromCodeStationBatched :");
		// console.log(station_pc.data);
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
		if (map && CoursDeau.length > 0) {

			console.log("CoursDeau changed, so lets add it to the map")
			console.log(CoursDeau)

			const features = [];
			
			for(var i=0;i<CoursDeau.length;i++){
				if(CoursDeau[i].geoJson.features[0] && CoursDeau[i].geoJson.features[0].geometry && CoursDeau[i].geoJson.features[0].geometry.type === "LineString"){
					const OLFormatted_LineString = new LineString(CoursDeau[i].geoJson.features[0].geometry.coordinates);
					const OLFeature = new Feature(OLFormatted_LineString)
					console.log("OLFormatted_LineString :");
					console.log(OLFormatted_LineString);

					var color = "darkblue";
					if(substance){
						color = "slategrey";
					}

					if (substance === "Carbamazepine") {
						if(CoursDeau[i].linked_stations.some(station => station.csvLines.some(line => line[0] === "Carbamazepine"))){
							if(CoursDeau[i].linked_stations.some(station => station.csvLines.some(line => line[0] === "Carbamazepine" && parseFloat(line[8]) >= 0.05))){
								color = "red";
							} else{
								color = "green";
							}
						}
					}

						if (substance === "Ibuprofène") {
						if(CoursDeau[i].linked_stations.some(station => station.csvLines.some(line => line[0] === "Ibuprofène"))){
							if(CoursDeau[i].linked_stations.some(station => station.csvLines.some(line => line[0] === "Ibuprofène" && parseFloat(line[8]) >= 0.22))){
								color = "red";
							} else{
								color = "green";
							}
						}
					}

					if (substance === "Erythromycine") {
						var threshold = 0.5;
						if(CoursDeau[i].linked_stations.some(station => station.csvLines.some(line => line[0] === "Erythromycine"))){
							if(CoursDeau[i].linked_stations.some(station => station.csvLines.some(line => line[0] === "Erythromycine" && parseFloat(line[8]) >= threshold))){
								color = "red";
							} else{
								color = "green";
							}
						}
					}

					if (substance === "17 beta-Estradiol") {
						var threshold = 0.00018;
						if(CoursDeau[i].linked_stations.some(station => station.csvLines.some(line => line[0] === "17 beta-Estradiol"))){
							if(CoursDeau[i].linked_stations.some(station => station.csvLines.some(line => line[0] === "17 beta-Estradiol" && parseFloat(line[8]) >= threshold))){
								color = "red";
							} else{
								color = "green";
							}
						}
					}



					if (substance === "Azithromycine") {
						var threshold = 0.019;
						if(CoursDeau[i].linked_stations.some(station => station.csvLines.some(line => line[0] === "Azithromycine"))){
							if(CoursDeau[i].linked_stations.some(station => station.csvLines.some(line => line[0] === "Azithromycine" && parseFloat(line[8]) >= threshold))){
								color = "red";
							} else{
								color = "green";
							}
						}
					}

					if (substance === "Clarythromycine") {
						var threshold = 0.13;
						if(CoursDeau[i].linked_stations.some(station => station.csvLines.some(line => line[0] === "Clarythromycine"))){
							if(CoursDeau[i].linked_stations.some(station => station.csvLines.some(line => line[0] === "Clarythromycine" && parseFloat(line[8]) >= threshold))){
								color = "red";
							} else{
								color = "green";
							}
						}
					}

					if (substance === "Diclofenac") {
						var threshold = 0.04;
						if(CoursDeau[i].linked_stations.some(station => station.csvLines.some(line => line[0] === "Diclofenac"))){
							if(CoursDeau[i].linked_stations.some(station => station.csvLines.some(line => line[0] === "Diclofenac" && parseFloat(line[8]) >= threshold))){
								color = "red";
							} else{
								color = "green";
							}
						}
					}
					if (substance === "Estrone") {
						var threshold = 0.00036;
						if(CoursDeau[i].linked_stations.some(station => station.csvLines.some(line => line[0] === "Estrone"))){
							if(CoursDeau[i].linked_stations.some(station => station.csvLines.some(line => line[0] === "Estrone" && parseFloat(line[8]) >= threshold))){
								color = "red";
							} else{
								color = "green";
							}
						}
					}

						if (substance === "Norethindrone") {
						var threshold = 0.04;
						if(CoursDeau[i].linked_stations.some(station => station.csvLines.some(line => line[0] === "Norethindrone"))){
							if(CoursDeau[i].linked_stations.some(station => station.csvLines.some(line => line[0] === "Norethindrone" && parseFloat(line[8]) >= threshold))){
								color = "red";
							} else{
								color = "green";
							}
						}
					}

					if (substance === "Ofloxacine") {
						var threshold = 0.11;
						if(CoursDeau[i].linked_stations.some(station => station.csvLines.some(line => line[0] === "Ofloxacine"))){
							if(CoursDeau[i].linked_stations.some(station => station.csvLines.some(line => line[0] === "Ofloxacine" && parseFloat(line[8]) >= threshold))){
								color = "red";
							} else{
								color = "green";
							}
						}
					}

				


			


					const Station_style = new Style({
						stroke: new Stroke({
							color: color,
							width: 2,
						}),
					})

					OLFeature.setStyle(Station_style)
					features.push(OLFeature) 
				} else {
					console.log("Warning, following cours d'eau doesnt have a feature in its geoJson or not a LineString")
					console.log(CoursDeau[i])
				}
			}

			console.log("features")
			console.log(features)
			setFeatures(features)


			map.addLayer(
				new VectorLayer({
					source: new VectorSource({
						features: features,
					}),
					style: new Style({
						stroke: new Stroke({
						  //color: 'rgba(0, 0, 200, 1)', //finished line
						  width: 2,
						}),
					}),
				})
			);
		}
	},[CoursDeau,substance]);

	function hide_features(features, map) {
		// features.setStyle(new Style({}));
		map.removeLayer(features)
		console.log("rivers removed ! ")
	}

return (
    <div>
        <h1>MapGenerationFuture</h1>

        <input
            type="file"
            name="file"
            accept=".csv"
            onChange={LoadCSVFile}
            style={{ display: "block", margin: "10px auto" }}
        />
		<div id="button_cont">
			<p>Choisissez un médicament pour afficher la carte des seuils d'éco-toxicité correspondante</p>
			<SubstanceButton sub={"Diclofenac"}/>
			<SubstanceButton sub={"Carbamazepine"}/>
			<SubstanceButton sub={"Ibuprofène"}/>
			<SubstanceButton sub={"Clarythromycine"}/>
			<SubstanceButton sub={"Azithromycine"}/>
			<SubstanceButton sub={"Erythromycine"}/>
			<SubstanceButton sub={"17 beta-Estradiol"}/>
			<SubstanceButton sub={"Estrone"}/>
			<SubstanceButton sub={"Norethindrone"}/>
			<SubstanceButton sub={"Ofloxacine"}/>
			{/* <button onClick={hide_features} id="hiderivers">affichage rivières</button> */}
		</div>
		{loadingStatus && <Loading/>}
        <div id="mapGF" className='map-container'></div>
		<Legende/><img style={{width:"200px"}} src={logoGN}></img><img style={{width:"200px"}} src={logoDG}></img>
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