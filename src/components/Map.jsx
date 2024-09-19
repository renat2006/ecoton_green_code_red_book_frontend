import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import mapboxgl from 'mapbox-gl';
import React, {useEffect, useRef, useState} from 'react';
import {Card, Button, Checkbox, Collapse, Input} from 'antd';
import {CheckCircleOutlined, CloseOutlined, FilterOutlined, SearchOutlined} from "@ant-design/icons";
import polygonData from '../store/polygon_data.json';

const {Panel} = Collapse;

const MapComponent = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const [selectedPolygons, setSelectedPolygons] = useState(polygonData.features.map(feature => feature.id));
    const [isCardVisible, setIsCardVisible] = useState(false); // State to control card visibility on mobile
    const [cadastralNumber, setCadastralNumber] = useState(''); // State for cadastral number
    const [highlightedFeature, setHighlightedFeature] = useState(null); // State to store the highlighted feature

    useEffect(() => {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

        if (!mapRef.current) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: import.meta.env.VITE_MAP_STYLE,
                center: [37.617644, 55.755819],
                zoom: 15,
            });

            mapRef.current.on('load', () => {
                // Add polygons to the map
                mapRef.current.addSource('polygons', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: polygonData.features
                    }
                });

                mapRef.current.addLayer({
                    id: 'polygon-layer',
                    type: 'fill',
                    source: 'polygons',
                    paint: {
                        'fill-color': '#088',
                        'fill-opacity': 0.5,
                    }
                });
            });
        }
    }, []);

    // Function to update the displayed polygons based on the filter
    const updatePolygons = () => {
        const filteredFeatures = polygonData.features.filter(feature => selectedPolygons.includes(feature.id));
        const data = {
            type: 'FeatureCollection',
            features: filteredFeatures
        };

        if (mapRef.current.getSource('polygons')) {
            mapRef.current.getSource('polygons').setData(data);
        }
    };

    useEffect(() => {
        updatePolygons();
    }, [selectedPolygons]);

    // Function to search and highlight a feature by cadastral number
    const searchByCadastralNumber = async () => {
        try {
            const response = await fetch(`https://pkk.rosreestr.ru/api/features/1/${cadastralNumber}`);
            if (!response.ok) throw new Error('Failed to fetch cadastral data');

            const data = await response.json();
            const feature = data.feature;
            console.log(data)
            if (feature && feature.extent) {
                // Convert the coordinates from EPSG:3857 to WGS84
                const [xmin, ymin] = convertEPSG3857ToWGS84(feature.extent.xmin, feature.extent.ymin);
                const [xmax, ymax] = convertEPSG3857ToWGS84(feature.extent.xmax, feature.extent.ymax);

                // Create a GeoJSON feature for the found object
                const geoJsonFeature = {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: [[
                            [xmin, ymin],
                            [xmin, ymax],
                            [xmax, ymax],
                            [xmax, ymin],
                            [xmin, ymin],
                        ]]
                    },
                    properties: {
                        id: feature.attrs.cn,
                        name: feature.attrs.address,
                    }
                };

                // Add or update the highlighted feature on the map
                if (highlightedFeature) {
                    mapRef.current.getSource('highlighted-feature').setData(geoJsonFeature);
                } else {
                    mapRef.current.addSource('highlighted-feature', {
                        type: 'geojson',
                        data: geoJsonFeature
                    });

                    mapRef.current.addLayer({
                        id: 'highlighted-feature-layer',
                        type: 'fill',
                        source: 'highlighted-feature',
                        paint: {
                            'fill-color': '#ff0000',
                            'fill-opacity': 0.5,
                        }
                    });

                    setHighlightedFeature(geoJsonFeature);
                }

                // Center the map on the found feature
                console.log()
                mapRef.current.fitBounds([
                    [xmin, ymin],
                    [xmax, ymax],
                ], {
                    padding: 20
                });
            } else {
                alert('Object not found');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error fetching cadastral data');
        }
    };

// Conversion function
    function convertEPSG3857ToWGS84(x, y) {
        const lon = (x / 20037508.34) * 180;
        let lat = (y / 20037508.34) * 180;
        lat = (180 / Math.PI) * (2 * Math.atan(Math.exp((lat * Math.PI) / 180)) - Math.PI / 2);
        return [lon, lat];
    }

    // Toggle card visibility on mobile
    const toggleCardVisibility = () => {
        setIsCardVisible(!isCardVisible);
    };

    // Handle checkbox change
    const handleCheckboxChange = (checkedValues) => {
        setSelectedPolygons(checkedValues);
    };

    return (
        <div className="relative h-[calc(100vh_-_60px)] mt-[60px] w-full">
            {/* Toggle Button for Mobile */}
            <div className="absolute top-4 left-4 z-20 md:hidden">
                {!isCardVisible && (
                    <Button onClick={toggleCardVisibility} type="primary" shape="circle"
                            icon={<FilterOutlined/>}></Button>
                )}
            </div>

            {/* Card */}
            <div
                className={`absolute top-0 left-0 z-10 ${
                    isCardVisible ? 'block' : 'hidden md:block'
                } w-full md:w-[300px] h-full`}
            >
                <Card
                    title="Фильтр"
                    extra={isCardVisible ?
                        <Button onClick={toggleCardVisibility} type="text" icon={<CloseOutlined/>}></Button> : <></>}
                    className="h-full overflow-auto"
                >
                    <Collapse>
                        <Panel header="Зоны парков" key="1">
                            <Checkbox.Group
                                style={{display: 'flex', flexDirection: 'column'}}
                                onChange={handleCheckboxChange}
                                value={selectedPolygons}
                            >
                                {polygonData.features.map(feature => (
                                    <Checkbox key={feature.id} value={feature.id}>
                                        {feature.properties.name}
                                    </Checkbox>
                                ))}
                            </Checkbox.Group>
                        </Panel>
                    </Collapse>

                    {/* Search by Cadastral Number */}
                    <div className="mt-4 flex gap-5">
                        <Input
                            placeholder="Введите кадастровый номер"
                            value={cadastralNumber}
                            onChange={(e) => setCadastralNumber(e.target.value)}
                            onPressEnter={searchByCadastralNumber}
                            suffix={<SearchOutlined/>}
                        />
                        <Button
                            type="primary"
                            onClick={searchByCadastralNumber}
                            className="mt-2"
                        >
                            Найти
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Map */}
            <div ref={mapContainerRef} className="h-full w-full"></div>
        </div>
    );
};

export default React.memo(MapComponent);
