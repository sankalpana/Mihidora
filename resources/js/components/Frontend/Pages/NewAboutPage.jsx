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

const styles = {
    homeBanner: {
        backgroundImage: `url(${"../../../../images/home_banner-1.jpg"})`
    },
    footerBanner: {
        marginTop: '100px',
        backgroundImage: `url(${"../../../../images/sri-lanka-beach.jpg"})`
    }
}

function NewAboutPage() {
    const pageTemplate = 'home';
    const [exploreTitle, setExploreTitle] = useState([]);
    const [projectDescription, setProjectDescription] = useState([]);
    const [dataDescription, setDataDescription] = useState([]);
    const [resourceDescription, setResourceDescription] = useState([]);
    const [elearningDescription, setElearningDescription] = useState([]);
    const [whatsonTitle, setWhatsonTitle] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const [projectLoad, setProjectLoad] = useState(true);
    const [eventList, setEventList] = useState([]);
    const [eventLoad, setEventLoad] = useState(true);
    const [stats, setStats] = useState({
        organisations: 0,
        projects: 0,
        events: 0,
        knw_projects: 0
    });

    useEffect(() => {
        loadProjects({ skip: 0, take: 4 });
        loadEvents({ skip: 0, take: 4, type: 1 });
        loadCounters();
    }, []);

    const loadCounters = () => {
        axios.get('/api/get-aboutus-counters').then(res => {
            console.log(res);
            if (res.data.status == 200) {
                console.log(res.data);
                setStats({
                    organisations: res.data.organisations,
                    projects: res.data.projects,
                    events: res.data.events,
                    knw_projects: res.data.knowledge_products
                });
            } else {
                // handle the error
                console.log(res.data);
            }
        });
    }

    const loadProjects = (data) => {
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post('/api/get-projects', data).then(res => {
                console.log(res)
                if (res.status == 200) {
                    setProjectList(res.data.projects);
                    setProjectLoad(false);
                } else {
                    // handle the error
                    setProjectLoad(false);
                }
            });
        });
    }

    const loadEvents = (data) => {
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post('/api/get-events-list', data).then(res => {
                console.log(res)
                if (res.status == 200) {
                    setEventList(res.data.projects);
                    setEventLoad(false);
                } else {
                    // handle the error
                    setEventLoad(false);
                }
            });
        });
    }

    const handleImageError = (event) => {
        event.target.src = '../../../../images/project-default.jpg'; // Set the fallback image URL
    };

    return (
        <BaseLayout className="home-page" title={"Home page"}>
            <div className="static-wrapper">
                <div className="banner-containers">
                    <Grid container spacing={2}>
                        <Grid item lg={12} className="banner-grids">
                            <Box className="banner-box" sx={{ textAlign: "center" }}>
                                <img src="../../../../images/mihidora-artwork-log-variant.png" />
                                <Typography mb={2} className="banner-h1" variant="h1">Spearheading the Protection of Sri Lanka’s Environment.</Typography>
                                <a className="banner-buttons" href="/register-as">Join Mihidora</a>
                            </Box>
                        </Grid>
                    </Grid>
                </div>

                <Container sx={{ marginTop: '100px' }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        <Typography mb={2} className="static-h2" variant="h2">About Mihidora</Typography>
                        <Typography mb={2} className="static-body" variant="body1" sx={{ textAlign: 'center' }}>
                            Welcome to Mihidora, where data, toolkits and resources for conservation and environmental initiatives reside on one convenient online platform.
                        </Typography>
                        <Typography mb={2} className="static-body" variant="body1" sx={{ textAlign: 'center' }}>
                            Mihidora aims:
                        </Typography>
                        <Box sx={{ width: { lg: '70%', md: '100%' } }}>
                            <ul>
                                <li className="list-text">To effectively share knowledge and expertise to support environmental protection and sustainability. </li>
                                <li className="list-text">To connect different interest groups to consistently organise, mobilise, educate and campaign against environmental destruction. </li>
                                <li className="list-text">To promote awareness and projects that are vital for the sustainability of the country’s environment. </li>
                                <li className="list-text">To influence environmental policy through the conducting of research and knowledge enhancement. </li>
                            </ul>
                        </Box>
                    </Box>

                    {/* <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        <Typography mb={2} className="static-h2" variant="h2">About Mihidora</Typography>
                        <Typography mb={2} className="static-body" variant="body1" sx={{ textAlign: 'center' }}>
                            To effectively share knowledge and expertise to support environmental protection and sustainability. To connect different interest groups to consistently organize, mobilize, educate and campaign against environmental destruction To promote awareness and projects that are vital for the sustainability of the country’s environment. To Influence environmental policy through the conducting of research and knowledge enhancement.
                        </Typography>
                        <Stack direction="row" spacing={2} mt={3}>
                        </Stack>
                    </Box> */}
                </Container>

                {/* <Container sx={{ marginTop: '100px' }} className="featured-home">
                    <Grid sx={{ flexGrow: 1 }} container spacing={2} className="stat-grid">
                        <Grid item lg={3} sx={{ textAlign: 'center' }}>
                            <CircularStatComponent value={40} />
                            <Typography mb={2} className="static-body-secondary" variant="body1" sx={{ textAlign: 'center' }}>
                                Organizations
                            </Typography>
                        </Grid>
                        <Grid item lg={3} sx={{ textAlign: 'center' }}>
                            <CircularStatComponent value={50} />
                            <Typography mb={2} className="static-body" variant="body1" sx={{ textAlign: 'center' }}>
                                Projects
                            </Typography>
                        </Grid>
                        <Grid item lg={3} sx={{ textAlign: 'center' }}>
                            <CircularStatComponent value={60} />
                            <Typography mb={2} className="static-body-secondary" variant="body1" sx={{ textAlign: 'center' }}>
                                Events
                            </Typography>
                        </Grid>
                        <Grid item lg={3} sx={{ textAlign: 'center' }}>
                            <CircularStatComponent value={100} />
                            <Typography mb={2} className="static-body-secondary" variant="body1" sx={{ textAlign: 'center' }}>
                                Knowledge Products
                            </Typography>
                        </Grid>
                    </Grid>
                </Container> */}

                <Container sx={{ marginTop: '100px' }} className="featured-home">
                    <Grid sx={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }} container spacing={2} className="stat-grid">
                        <Grid item lg={3} sx={{ textAlign: 'center' }}>
                            <div className="circ-stat">
                                <Typography mb={2} className="circ-stat-text" variant="body1" sx={{ textAlign: 'center' }}>
                                    {stats.organisations}
                                </Typography>
                            </div>
                            <Typography mb={2} className="static-body-secondary" variant="body1" sx={{ textAlign: 'center', marginTop: '8px' }}>
                                Organisations
                            </Typography>
                        </Grid>
                        <Grid item lg={3} sx={{ textAlign: 'center' }}>
                            <div className="circ-stat">
                                <Typography mb={2} className="circ-stat-text" variant="body1" sx={{ textAlign: 'center' }}>
                                    {stats.projects}
                                </Typography>
                            </div>
                            <Typography mb={2} className="static-body-secondary" variant="body1" sx={{ textAlign: 'center', marginTop: '8px' }}>
                                Projects
                            </Typography>
                        </Grid>
                        <Grid item lg={3} sx={{ textAlign: 'center' }}>
                            <div className="circ-stat">
                                <Typography mb={2} className="circ-stat-text" variant="body1" sx={{ textAlign: 'center' }}>
                                    {stats.events}
                                </Typography>
                            </div>
                            <Typography mb={2} className="static-body-secondary" variant="body1" sx={{ textAlign: 'center', marginTop: '8px' }}>
                                Events
                            </Typography>
                        </Grid>
                        <Grid item lg={3} sx={{ textAlign: 'center' }}>
                            <div className="circ-stat">
                                <Typography mb={2} className="circ-stat-text" variant="body1" sx={{ textAlign: 'center' }}>
                                    {stats.knw_projects}
                                </Typography>
                            </div>
                            <Typography mb={2} className="static-body-secondary" variant="body1" sx={{ textAlign: 'center', marginTop: '8px' }}>
                                Knowledge Products
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>

                <Container sx={{ marginTop: '100px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={12} sx={{ textAlign: 'center' }}>
                            <Typography className="static-h3" variant="h3" sx={{ mb: 8 }}>Mihidora is an initiative by FEO</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={6} sx={{ textAlign: 'center' }}>
                            <Stack direction="row" spacing={2}>
                                <img style={{
                                    maxHeight: '48px',
                                    width: 'auto',
                                    margin: 'auto'
                                }} src={'../../../images/feo-logo.png'} />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} lg={6}>

                            <Typography mb={2} className="static-body" variant="body1" sx={{ textAlign: 'left' }}>
                                The Federation of Environmental Organizations (FEO) is a non‐political, non-partisan organization that provides a platform for connecting interest groups with a patriotic interest in safeguarding Sri Lanka’s natural heritage through conservation and advocacy. It has a wide network of members, partners, scientists, professionals, Government officials, social media platforms, activists and legal experts on whom to call on for partnering projects.
                            </Typography>
                            <Stack direction="row" spacing={2} mt={3}>
                                <a className="banner-buttons" href="/organization/feosrilanka">View Our Projects</a>
                                <a className="banner-buttons-outline" href="https://feosrilanka.org/">More about FEO</a>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
                <Container sx={{ marginTop: '100px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={12} sx={{ textAlign: 'center' }}>
                            <Typography className="static-h3" variant="h3" sx={{ mb: 8 }}>Supported By</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={12} sx={{ textAlign: 'center' }}>
                            <Stack direction={{ xs: 'column', sm: 'row' }}
                                spacing={{ xs: 1, sm: 2, md: 4 }}>
                                <Stack direction={{ xs: 'column' }}>
                                    <img style={{
                                        maxHeight: '100px',
                                        width: 'auto',
                                        margin: 'auto'
                                    }} src={'../../../images/logos/taf.png'} />
                                    <p>The Asia Foundation</p>
                                </Stack>
                                <Stack direction={{ xs: 'column' }}>
                                    <img style={{
                                        maxHeight: '100px',
                                        width: 'auto',
                                        margin: 'auto'
                                    }} src={'../../../images/logos/lfs.jpg'} />
                                    <p>Lanka Software Foundation</p>
                                </Stack>
                                <Stack direction={{ xs: 'column' }}>
                                    <img style={{
                                        maxHeight: '100px',
                                        width: 'auto',
                                        margin: 'auto'
                                    }} src={'../../../images/logos/encyte.png'} />
                                    <p>Encyte</p>
                                </Stack>
                                <Stack direction={{ xs: 'column' }}>
                                    <img style={{
                                        maxHeight: '100px',
                                        width: 'auto',
                                        margin: 'auto'
                                    }} src={'../../../images/logos/oddly.jpg'} />
                                    <p>ODDLY</p>
                                </Stack>
                                <Stack direction={{ xs: 'column' }}>
                                    <img style={{
                                        maxHeight: '100px',
                                        width: 'auto',
                                        margin: 'auto'
                                    }} src={'../../../images/logos/sc.png'} />
                                    <p>Software Consultants</p>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>

                <div className="footer-banner" style={styles.footerBanner}>
                    <Grid container spacing={2}>
                        <Grid item lg={12} className="banner-grids">
                            <Box className="footer-banner-box">
                                <Typography className="banner-h1" variant="h1" sx={{ mb: 2, maxWidth: '90%', margin: '1rem auto' }}>
                                    Let's Unite to Save Sri Lanka's Environment!
                                </Typography>
                                <a className="banner-buttons" href="/register-as">Join Mihidora</a>
                            </Box>
                        </Grid>
                    </Grid>
                </div>

            </div>
        </BaseLayout>
    )
}

export default NewAboutPage