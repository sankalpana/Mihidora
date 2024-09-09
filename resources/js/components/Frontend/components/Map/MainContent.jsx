// MainContent.js
import React, { useEffect, useState } from "react";
import { Container, Typography } from '@mui/material';
import ClusteredMap from '../../ResourceExchange/ClusteredMap';

function MainContent({ selectedLocation, selectedTag, markers }) {
  const [mapConfigs, setMapConfigs] = useState({
    center: { lat: 7.491214239209488, lng: 80.71736087951162 },
    zoom: 9,
    open: false,
  })
  return (
    <Container sx={{ height: '100%', paddingLeft: '0px !important', paddingRight:'0px !important' }} maxWidth={false} >
      {/* Add your content here */}
      <div className="cluster-map" style={{ height: '100%', width: '100%' }}>
        <ClusteredMap
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=xxxxxxxxxxxxxx&v=3.exp&libraries=geometry,drawing,places`}
          // googleMapURL={`https://maps.googleapis.com/maps/api/staticmap?key=xxxxxxxxxxxxxx&center=47.65,-122.35&zoom=12&format=png&maptype=roadmap&style=element:geometry%7Ccolor:0xf5f5f5&style=element:labels.icon%7Cvisibility:off&style=element:labels.text.fill%7Ccolor:0x616161&style=element:labels.text.stroke%7Ccolor:0xf5f5f5&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0xbdbdbd&style=feature:poi%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:poi.park%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:road%7Celement:geometry%7Ccolor:0xffffff&style=feature:road.arterial%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:road.highway%7Celement:geometry%7Ccolor:0xdadada&style=feature:road.highway%7Celement:labels.text.fill%7Ccolor:0x616161&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:transit.line%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:transit.station%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:water%7Celement:geometry%7Ccolor:0xc9c9c9&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&size=480x360`}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100%` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          markers={markers}
          settings={mapConfigs}
        />
      </div>
    </Container>
  );
};
export default MainContent;