import React, { useState, useEffect } from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
import clusterImage from "../../../../../public/images/cluster.png";
import markerImage from "../../../../../public/images/marker.png";
import './map.css';

const ClusteredMap = withScriptjs(
    withGoogleMap((props) => {
        const { markers } = props;

        // Ref to the Google Map instance
        const mapRef = React.useRef(null);

        // Ref to the MarkerClusterer instance
        const markerClustererRef = React.useRef(null);

        // Callback function to initialize MarkerClusterer
        const handleMapLoad = (map) => {
            mapRef.current = map;

            // Create MarkerClusterer with options
            markerClustererRef.current = new MarkerClusterer(map, markers, {
                // imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
                imagePath: { clusterImage },
            });
        };
        return (
            <GoogleMap
                defaultZoom={props.settings.zoom}
                defaultCenter={props.settings.center}
                defaultOptions={{ styles: mapStyle }}
                ref={handleMapLoad}
            >
                <MarkerClusterer
                    averageCenter
                    enableRetinaIcons
                    gridSize={60}

                // Provide custom cluster icon class and style
                >
                    {markers.map((marker, index) => (
                        <Marker
                            key={index}
                            position={{ lat: marker.lat, lng: marker.lng }}
                            label={marker.text}
                            icon={markerImage}
                            onClick={() => toggleOpen({ open })}
                        >
                            {open && <InfoWindow onCloseClick={() => console.log('test')}>
                                <div>Test</div>
                            </InfoWindow>}

                        </Marker>
                    ))}
                </MarkerClusterer>
            </GoogleMap>
        );
    })
);

const mapStyle = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#f5f5f5"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#bdbdbd"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e5e5e5"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#dbec9d"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dadada"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e5e5e5"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#c9c9c9"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    }
];

export default ClusteredMap;
