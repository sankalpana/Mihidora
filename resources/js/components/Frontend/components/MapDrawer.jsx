import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Container,
    Grid,
    Typography,
    CardActions,
    CardContent,
    CardMedia,
    menuIcon,
    TextField,
    InputAdornment,
    FormControl,
    Select,
    ListItemText,
    ListItem,
    List,
    ListItemButton,
    ListItemIcon,
    MenuItem,
    InputLabel,
    Divider,
    Dialog,
    Toolbar,
    IconButton,
    Slide,
    Drawer,
    Button,
    Box,
} from "@mui/material";
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

import BaseLayout from "../BaseLayout";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';


function MapDrawer() {


    const drawer = (
        <div>
            <Toolbar className="map-toolBar" sx={{ backgroundColor: '#a8c255' }} />
            <Divider />
            <Grid container mt={3}>
                <Grid item>
                    <Typography ml={2}>Quickly sort through different key words and find information on Mihidora</Typography>
                </Grid>
            </Grid>
        </div>
    );

    return (
        <BaseLayout title={"Topic"}>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >

                <div className="map-top-div">
                    <CloseRoundedIcon sx={{ cursor: 'pointer', fontSize: 50, color: 'white' }} className="close-icon" onClick={handleClose} />
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                        className="icon-button-menu"
                    >
                        <MenuIcon sx={{ fontSize: 35 }} />
                    </IconButton>
                </div>

                <div style={{ display: 'flex', height: '100%', width: '100%' }}>
                    <div
                        component="nav"
                        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                        aria-label="mailbox folders"
                    >
                        <Drawer
                            // container={container}
                            variant="temporary"
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            ModalProps={{
                                keepMounted: true,
                            }}
                            sx={{
                                display: { xs: 'block', sm: 'none' },
                                '& .MuiDrawer-paper': {
                                    boxSizing: 'border-box',
                                    width: drawerWidth,
                                    border: 'none'
                                },
                            }}
                        >
                            {drawer}
                        </Drawer>
                        <Drawer
                            variant="permanent"
                            sx={{
                                display: { xs: 'none', sm: 'block' },
                                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
                            }}
                            open
                        >
                            {drawer}
                        </Drawer>
                    </div>
                    <div
                        component="main"
                        style={{ flexGrow: 1, p: 3, height: '100%', ml: { sm: `${drawerWidth}px` }, }}
                    >
                        {/* <Toolbar /> */}
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
                            {/* <Map google={google} zoom={13}>

                <Marker name={'Current location'} onClick={onMarkerClick} />

                <InfoWindow
                  marker={activeMarker}
                  onClose={windowHasClosed}
                  visible={true}
                >
                  <div>
                    <h3 className="mapInfoText">"Encyte"</h3>
                  </div>
                </InfoWindow>

              </Map> */}
                        </div>
                    </div>
                </div>
            </Dialog>
        </BaseLayout>
    )
}

export default
    GoogleApiWrapper({
        apiKey: process.env.GOOGLE_MAP_API_KEY,
    })(MapDrawer)
