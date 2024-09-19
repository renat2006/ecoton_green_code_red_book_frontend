import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import mapboxgl from 'mapbox-gl';
import React, { useEffect, useRef, useState } from 'react';
import { Card, Button, Checkbox, Collapse } from 'antd';
import { CheckCircleOutlined, CloseOutlined, FilterOutlined } from "@ant-design/icons";
import polygonData from '../store/polygon_data.json';

const { Panel } = Collapse;

const MapComponent = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const [selectedPolygons, setSelectedPolygons] = useState(polygonData.features.map(feature => feature.id));
    const [isCardVisible, setIsCardVisible] = useState(false); // State to control card visibility on mobile

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
                    <Button onClick={toggleCardVisibility} type="primary" shape="circle" icon={<FilterOutlined />}></Button>
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
                    extra={isCardVisible ? <Button onClick={toggleCardVisibility} type="text" icon={<CloseOutlined/>}></Button> : <></>}
                    className="h-full overflow-auto"
                >
                    <Collapse>
                        <Panel header="Зоны парков" key="1">
                            <Checkbox.Group
                                style={{ display: 'flex', flexDirection: 'column' }}
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
                        {/* Add more panels here for other filters */}
                    </Collapse>
                </Card>
            </div>

            {/* Map */}
            <div ref={mapContainerRef} className="h-full w-full"></div>
        </div>
    );
};

export default React.memo(MapComponent);
