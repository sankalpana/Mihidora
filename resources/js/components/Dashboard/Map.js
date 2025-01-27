import React, { Component } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Marker, Popup } from 'react-leaflet';
import { FormLabel } from "@mui/material"
import { EditControl } from "react-leaflet-draw";
import 'leaflet-draw/dist/leaflet.draw-src';

class MapExample extends Component {
  constructor(props) {
    super(props);
    this.onCreate = this.onCreate.bind(this);
  }

  onCreate = (e) => {
    this.props.getLanLat([...this.props.listLangLat, { ...e.layer.getLatLng() }])
  };

  onEdit = (e) => {
    const allMarkersAfterUpdate = [];
    e.target.eachLayer((l) => {
      // only markers have this func
      // XXX better if markers can be recognized formally
      const c = l.getLatLng && l.getLatLng();
      if (c) {
        allMarkersAfterUpdate.push({ ...c });
      }
    });

    this.props.getLanLat(allMarkersAfterUpdate);
  };

  // onDelete = (e) => {
  //   const allMarkersAfterDelete = [];
  //   e.layers.eachLayer((l) => {
  //     // only markers have this func
  //     // XXX better if markers can be recognized formally
  //     const c = l.getLatLng && l.getLatLng();
  //     if (c) {
  //       allMarkersAfterDelete.push({ ...c });
  //     }
  //   });

  //   this.props.getLanLat(allMarkersAfterDelete);
  // };

  onDelete = (e) => {
    const allMarkersAfterDelete = [];

    // Iterate over the existing markers and filter out the deleted ones
    this.props.listLangLat.forEach((existingMarker) => {
      const markerStillExists = e.layers.getLayers().some((deletedMarker) => {
        const deletedLatLng = deletedMarker.getLatLng();
        return (
          existingMarker.lat === deletedLatLng.lat &&
          existingMarker.lng === deletedLatLng.lng
        );
      });
      console.log(existingMarker);
      if (markerStillExists) {
        allMarkersAfterDelete.push({ ...existingMarker });
      }
    });

    // Update the parent component's state with the remaining markers
    this.props.getLanLat(allMarkersAfterDelete);
  };


  render() {
    return (
      <div style={{ marginBottom: 35 }}>
        <FormLabel>Location</FormLabel>
        <MapContainer
          center={this.props.center}
          zoom={this.props.zoom}
        >
          <FeatureGroup>
            <EditControl
              key={Math.random()} // hack to fix not updating captured variables
              position='topright'
              onCreated={this.onCreate}
              onEdited={this.onEdit}
              onDeleted={this.onDelete}
              draw={{
                marker: true,
                circle: false,
                circlemarker: false,
                rectangle: false,
                polygon: false,
                polyline: false
              }}
              edit={{
                marker: true,
                circle: false,
                circlemarker: false,
                rectangle: false,
                polygon: false,
                polyline: false,
              }}
            />
            {this.props.listLangLat !== null && this.props.listLangLat.length > 0 && this.props.listLangLat?.map((item, index) => {
              return <Marker key={index} position={item}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            })}

          </FeatureGroup>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>
    );
  }
}

export default MapExample;