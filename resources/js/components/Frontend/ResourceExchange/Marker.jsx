import React from 'react';

const Marker = ({ cluster, lat, lng }) => {
  const markers = cluster.getClusters([lng, lat], 0, 100);

  if (markers.length === 1) {
    // Individual marker
    return <div className="marker">1</div>;
  }

  // Cluster
  return (
    <div className="cluster-marker">
      {markers.length}
    </div>
  );
};

export default Marker;
