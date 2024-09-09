import React, { useState } from 'react';

const ClusterMarker = ({ cluster, map, lat, lng }) => {
  const [isCluster, setIsCluster] = useState(false);

  const markers = cluster.getLeaves(null, Infinity, [lat, lng]);
  const isClustered = markers.length > 1;

  const handleClick = () => {
    if (isClustered) {
      const bounds = new window.google.maps.LatLngBounds();

      markers.forEach((marker) => {
        bounds.extend(new window.google.maps.LatLng(marker.properties.lat, marker.properties.lng));
      });

      map.fitBounds(bounds);
    }
  };

  return (
    <div
      className={`cluster-marker ${isClustered ? 'clustered' : ''}`}
      onClick={handleClick}
    >
      {isClustered ? markers.length : ''}
    </div>
  );
};

export default ClusterMarker;