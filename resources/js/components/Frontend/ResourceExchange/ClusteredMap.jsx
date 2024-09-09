import React, { useState, useEffect } from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
import Chip from '@mui/material/Chip';
import markerImage from "../../../../../public/images/marker.png";
import markerImageBlack from "../../../../../public/images/marker-black.png";
import markerImageDarkGreen from "../../../../../public/images/marker-dark-green.png";
import projectMarker from "../../../../../public/images/project-marker.png";
import dataMarker from "../../../../../public/images/data-marker.png";
import eLearningMarker from "../../../../../public/images/e-learning-marker.png";
import jobMarker from "../../../../../public/images/job-marker.png";
import grantMarker from "../../../../../public/images/grants-marker.png";
import supplierMarker from "../../../../../public/images/supplier-marker.png";
import resourceMarker from "../../../../../public/images/resource-marker.png";
import OrgMarker from "../../../../../public/images/organisation.png";
import CardMedia from '@mui/material/CardMedia';
import './map.css';

const ClusteredMap = withScriptjs(
    withGoogleMap((props) => {
        const { markers, settings } = props;
        const [mapCenter, setMapCenter] = useState(settings.center);
        let [map, setMap] = useState('');
        const [selectedMarker, setSelectedMarker] = useState(null);
        const handleMarkerClick = (marker) => {
            setSelectedMarker(marker);
        };

        const handleInfoWindowClose = () => {
            setSelectedMarker(null);
        };

        const handleMarkerHover = (marker) => {
            setSelectedMarker(marker);
        };

        const handleMarkerMouseOut = () => {
            setSelectedMarker(null);
        };

        useEffect(() => {
            setMapCenter(settings.center);
            console.log('Updating the center', settings.zoom);
            map.panTo(settings.center);
        }, [settings]);

        const labelToIconMap = {
            'Project': projectMarker,
            'Data': dataMarker,
            'E-Learning': eLearningMarker,
            'Job': jobMarker,
            'Grants & RFP': grantMarker,
            'Supplier': supplierMarker,
            'Resource': resourceMarker,
            'Organization': OrgMarker
        };

        return (
            <GoogleMap
                defaultZoom={props.settings.zoom}
                defaultCenter={mapCenter}
                defaultOptions={{ styles: mapStyle }}
                id="resourceMap"
                ref={(gmap) => (map = gmap)}
            >
                <MarkerClusterer
                    averageCenter
                    enableRetinaIcons
                    defaultMinimumClusterSize={4}
                    gridSize={30}

                // Provide custom cluster icon class and style
                >
                    {markers.map((marker, index) => (
                        <Marker
                            key={index}
                            position={{ lat: marker.lat, lng: marker.lng }}
                            label={''}
                            icon={labelToIconMap[marker.label]}
                            onClick={() => handleMarkerClick(marker)}
                            onMouseOver={() => handleMarkerHover(marker)}
                        >
                            {selectedMarker === marker && (
                                <InfoWindow 
                                    onCloseClick={handleInfoWindowClose}
                                    onMouseOut={handleMarkerMouseOut}
                                    >
                                    {/* Content for the InfoWindow */}
                                    <div>
                                        <CardMedia
                                            sx={{ height: 140 }}
                                            image="../../../images/project-default.jpg"
                                            title="Project"
                                        />
                                        <h2>{marker.text}</h2>
                                        <p>{marker.overview}</p>
                                        <Chip sx={{ backgroundColor: '#edf7c9', color: '#000000' }} label="View More" component="a" href={marker.url} clickable />
                                    </div>
                                </InfoWindow>
                            )}
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
