import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Grid,
    Box,
    Container,
    Typography,
    Stack,
    CardMedia,
    CardContent,
    Chip,
} from "@mui/material";
import { spacing } from '@mui/system';
import BaseLayout from "../BaseLayout";
import LogoCarousal from "../components/LogoCarousal";
import ListSkeleton8 from '../components/ListSkeleton8';
import CircularStatComponent from '../components/CircularStatComponent';
import PageMap from '../components/Map/PageMap';

const styles = {
    homeBanner: {
        backgroundImage: `url(${"../../../../images/home_banner-1.jpg"})`
    },
    footerBanner: {
        marginTop: '100px',
        backgroundImage: `url(${"../../../../images/sri-lanka-beach.jpg"})`
    }
}

function FullMap() {
    

    

    return (
        <BaseLayout className="home-page" title={"Home page"}>
            <div className="map-wrapper">
                <PageMap topic={'all'} />
            </div>
        </BaseLayout>
    )
}

export default FullMap