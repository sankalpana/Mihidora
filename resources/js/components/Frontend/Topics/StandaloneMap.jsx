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
  Box,
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
  Slide
} from "@mui/material";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

import BaseLayout from "../BaseLayout";

function StandaloneMap() {
  
  return (
    <BaseLayout title={"Topic"}>
        <h1>New Map Component</h1>
    </BaseLayout>
  )
}

export default
  GoogleApiWrapper({
    apiKey: process.env.GOOGLE_MAP_API_KEY,
  })(StandaloneMap)
