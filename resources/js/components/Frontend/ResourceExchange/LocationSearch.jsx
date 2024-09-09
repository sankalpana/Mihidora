import React from 'react';
import { compose, withProps, lifecycle } from 'recompose';
//import { StandaloneSearchBox } from 'react-google-maps/lib/components/places/StandaloneSearchBox';


const {
  withScriptjs,
} = require("react-google-maps");
const { StandaloneSearchBox } = require("react-google-maps/lib/components/places/StandaloneSearchBox");

const LocationSearch = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=xxxxxxxxxxxxxx&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {}

      this.setState({
        places: [],
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          this.props.onPlacesChanged(places);
          this.setState({
            places,
          });
        },
      })
    },
  }),
  withScriptjs  
)(props =>
  <div data-standalone-searchbox="">
    <StandaloneSearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder="Location"
        style={{
          boxSizing: `border-box`,
          border: `1px solid #63626261`,
          width: `100%`,
          // height: `32px`,
          padding: `10.5px 14px 11.5px 14px`,
          borderRadius: `4px`,
          // boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
        }}
      />
    </StandaloneSearchBox>
    {/* <ol>
      {props.places.map(({ place_id, formatted_address, geometry: { location } }) =>
        <li key={place_id}>
          {formatted_address}
          {" at "}
          ({location.lat()}, {location.lng()})
        </li>
      )}
    </ol> */}
  </div>
);


export default LocationSearch;