import React from 'react';

const MapGenerator = () => {

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

    var mapAlready = false

    useEffect(() => {
        if(!mapAlready){
            const initialmap = new Map({
                target: 'map3',
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

            setMap(initialMap);
            mapAlready = true;
        }
    }, []);

    useEffect(() => {
        if(map){
            vectorLayer.changed() 
        }
    }, [Coordinates]);

return (
    <div>
        
    </div>
)}

export default MapGenerator;