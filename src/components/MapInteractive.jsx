import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import React, { useEffect, useRef, useState } from 'react';

const MapComponent = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const drawRef = useRef(null); // Ref to hold the Mapbox Draw instance
    const [polygonData, setPolygonData] = useState(null);

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
                const Draw = new MapboxDraw({
                    displayControlsDefault: false,
                    controls: {
                        polygon: true, // Enable polygon drawing
                        trash: true,
                    },
                });
                mapRef.current.addControl(Draw);
                drawRef.current = Draw;

                // Handle draw events
                mapRef.current.on('draw.create', updatePolygonData);
                mapRef.current.on('draw.update', updatePolygonData);
                mapRef.current.on('draw.delete', () => setPolygonData(null));
            });
        }
    }, []);

    // Function to update polygon data when drawing
    const updatePolygonData = () => {
        const data = drawRef.current.getAll();
        if (data.features.length > 0) {
            setPolygonData(data);
        } else {
            setPolygonData(null);
        }
    };

    // Function to handle save button click
    const handleSave = () => {
        if (polygonData) {
            // Create a JSON Blob with the polygon data
            const blob = new Blob([JSON.stringify(polygonData, null, 2)], { type: 'application/json' });
            // Create a URL for the Blob
            const url = URL.createObjectURL(blob);
            // Create a temporary anchor element to trigger download
            const a = document.createElement('a');
            a.href = url;
            a.download = 'polygon_data.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            // Release the URL after download
            URL.revokeObjectURL(url);
        } else {
            alert('No polygon drawn to save.');
        }
    };

    return (
        <div className="relative h-[calc(100vh_-_60px)] mt-[60px] w-full">
            {/* Drawer */}
            <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg z-10">
                <button
                    onClick={handleSave}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Save Polygon
                </button>
            </div>
            {/* Map */}
            <div ref={mapContainerRef} className="h-full w-full"></div>
        </div>
    );
};

export default React.memo(MapComponent);
