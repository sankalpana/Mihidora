// App.js
import React, { useState } from 'react';
import {
    CssBaseline,
    useMediaQuery,
    useTheme,
    Box,
    Button,
    Grid,
    Stack,
    Typography
} from '@mui/material';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MainContent from './MainContent';
import TuneIcon from '@mui/icons-material/Tune';
import exploreImg from "../../../../../images/explore-menu.jpg";
import projectMarker from "../../../../../../public/images/project-marker.png";
import dataMarker from "../../../../../../public/images/data-marker.png";
import eLearningMarker from "../../../../../../public/images/e-learning-marker.png";
import jobMarker from "../../../../../../public/images/job-marker.png";
import grantMarker from "../../../../../../public/images/grants-marker.png";
import supplierMarker from "../../../../../../public/images/supplier-marker.png";
import resourceMarker from "../../../../../../public/images/resource-marker.png";
import OrgMarker from "../../../../../../public/images/organisation.png";


const PageMap = ({ topic }) => {
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [markers, setMarkers] = useState([]);

    const handleSidebarOpen = () => {
        setIsSidebarOpen(true);
    };

    const handleSidebarClose = () => {
        setIsSidebarOpen(false);
    };

    const handleSelectChange = (values) => {
        setSelectedLocation(values.location);
        setSelectedTag(values.tag);
    };

    const updateMarkers = (newMarkers) => {
        setMarkers(newMarkers);
    };

    return (
        <>
            <CssBaseline />
            {/* <TopBar handleOpen={handleSidebarOpen} /> */}
            <Grid container>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <Box sx={{ paddingLeft: '10px' }}>
                        <Button onClick={handleSidebarOpen} sx={{
                            border: '1px solid rgb(255 255 255 / 0%)',
                            color: 'black',
                            '&.MuiButton-root:hover': {
                                border: '1px solid #1976d200',
                            }
                        }} variant="outlined" endIcon={<TuneIcon sx={{ color: 'black' }} />}>
                            Filters
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={8} lg={8}>
                    <Box sx={{ paddingLeft: '10px', marginLeft: '16px' }}>
                        <Stack direction="row">
                        <Stack direction="row" sx={{ alignItems: 'center' }}>
                                <img src={OrgMarker} style={{ maxHeight: '24px' }} />
                                <Typography sx={{ fontSize: '12px' }}>Organisations</Typography>
                            </Stack>
                            <Stack direction="row" sx={{ alignItems: 'center' }}>
                                <img src={projectMarker} style={{ maxHeight: '24px' }} />
                                <Typography sx={{ fontSize: '12px' }}>Projects</Typography>
                            </Stack>
                            <Stack direction="row" sx={{ alignItems: 'center', marginLeft: '8px' }}>
                                <img src={dataMarker} style={{ maxHeight: '24px' }} />
                                <Typography sx={{ fontSize: '12px' }}>Data</Typography>
                            </Stack>
                            <Stack direction="row" sx={{ alignItems: 'center', marginLeft: '8px' }}>
                                <img src={eLearningMarker} style={{ maxHeight: '24px' }} />
                                <Typography sx={{ fontSize: '12px' }}>E-Learning</Typography>
                            </Stack>
                            <Stack direction="row" sx={{ alignItems: 'center', marginLeft: '8px' }}>
                                <img src={jobMarker} style={{ maxHeight: '24px' }} />
                                <Typography sx={{ fontSize: '12px' }}>Jobs</Typography>
                            </Stack>
                            <Stack direction="row" sx={{ alignItems: 'center', marginLeft: '8px' }}>
                                <img src={grantMarker} style={{ maxHeight: '24px' }} />
                                <Typography sx={{ fontSize: '12px' }}>Grants & RFPs</Typography>
                            </Stack>
                            <Stack direction="row" sx={{ alignItems: 'center', marginLeft: '8px' }}>
                                <img src={supplierMarker} style={{ maxHeight: '24px' }} />
                                <Typography sx={{ fontSize: '12px' }}>Suppliers</Typography>
                            </Stack>
                            <Stack direction="row" sx={{ alignItems: 'center', marginLeft: '8px' }}>
                                <img src={resourceMarker} style={{ maxHeight: '24px' }} />
                                <Typography sx={{ fontSize: '12px' }}>Resources</Typography>
                            </Stack>
                        </Stack>
                    </Box>
                </Grid>
            </Grid>


            {isLargeScreen ? (
                <Sidebar isOpen={isSidebarOpen} handleClose={handleSidebarClose} handleSelectChange={handleSelectChange} updateMarkers={updateMarkers} topic={topic} />
            ) : (
                <Sidebar isOpen={isSidebarOpen} handleClose={handleSidebarClose} handleSelectChange={handleSelectChange} updateMarkers={updateMarkers} topic={topic} />
            )}
            <MainContent selectedLocation={selectedLocation} selectedTag={selectedTag} markers={markers} setMarkers={setMarkers} />
        </>
    );
};

export default PageMap;
