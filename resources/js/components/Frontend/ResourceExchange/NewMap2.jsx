import React from 'react';
import ClusteredMap from './ClusteredMap';

const markers = [
  { lat: 40.7128, lng: -74.0060, text: 'Marker 1' },
  { lat: 40.7129, lng: -74.0061, text: 'Marker 2' },
  // Add more markers as needed
];

function NewMap2() {
  return (
    <div style={{ height: '500px', width: '100%' }}>
      <ClusteredMap
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=xxxxxxxxxxxxxx&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        markers={markers}
      />
    </div>
  );
}

export default NewMap2;