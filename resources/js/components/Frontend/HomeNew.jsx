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
import BaseLayout from "./BaseLayout";
import ProjIMG from "../../../images/project.jpg";
import HomeCarousal from "../Frontend/components/HomeCarousal";
import LogoCarousal from "../Frontend/components/LogoCarousal";
import ListSkeleton8 from '../Frontend/components/ListSkeleton8';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import DevicesIcon from '@mui/icons-material/Devices';
import PeopleIcon from '@mui/icons-material/People';
import InsightsIcon from '@mui/icons-material/Insights';

const styles = {
    homeBanner: {
        backgroundImage: `url(${"../../../images/home_banner-1.jpg"})`
    },
    footerBanner: {
        marginTop: '100px',
        backgroundImage: `url(${"../../../images/sri-lanka-beach.jpg"})`
    }
}

function HomeNew() {
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

    useEffect(() => {
        loadProjects({ skip: 0, take: 4 });
        loadEvents({ skip: 0, take: 4, type: 1 });
    }, []);

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
        event.target.src = '../../../images/project-default.jpg'; // Set the fallback image URL
    };

    return (
        <BaseLayout className="home-page" title={"Home page"}>
            <div className="static-wrapper">
                <div className="banner-containers" style={styles.homeBanner}>
                    <Grid container spacing={2}>
                        <Grid item lg={7} sm={12} xs={12} className="banner-grids">
                            <Box className="banner-box">
                                <Typography className="banner-h1" variant="h1">
                                    <span class="notranslate">MIHIDORA</span>
                                </Typography>
                                <Typography mb={2} className="banner-h1" variant="h1"><span class="notranslate">Environment Portal</span></Typography>
                                <Typography mb={2} variant="body1">Nurturing nature under one umbrella. Connect, stay updated, and play a pivotal role in sustaining the local environment</Typography>
                                <a className="banner-buttons" href="/projects">View Our Projects</a>
                                <Stack direction="row" spacing={2} sx={{ marginTop: '16px' }}>
                                    <Link className="simple-links" to="/org-directory" color="inherit" underline="always">Organisation Directory</Link>
                                    <Link className="simple-links" to="/organizations" color="inherit" underline="always">
                                        Organisation Profiles
                                    </Link>
                                </Stack>
                            </Box>
                        </Grid>
                        <Grid item lg={5}>

                        </Grid>
                    </Grid>
                </div>
                <Container sx={{ minHeight: '100px' }}>
                    {/* <LogoCarousal /> */}
                    <Grid container spacing={2}>
                        <Grid item lg={12} sm={12} xs={12} className="banner-grids">
                            <Box sx={{ marginTop: '32px', border:'solid 1px', padding:'16px' }}>
                                <Typography mb={2} variant="body1" sx={{ marginTop: '16px' }}>
                                    The site is embedded with a multilingual Google Translate Widget which has been set to English, Sinhala and Tamil. To translate the site, please click on the Translation Widget at the bottom right corner of the screen.
                                </Typography>
                                <Typography mb={2} variant="body1" sx={{ marginTop: '16px' }}>
                                    This floating Google Translate Widget can be found at the bottom right hand corner of the page.
                                    
                                    Please note that while the default site is in English, the English speaking audience will still need to click on the “English (ඉංග්‍රීසි) " translation feature to convert content uploaded in Sinhala or Tamil. Google keeps the language of origin as default and does not automatically translate content.
                                </Typography>
                            </Box>

                        </Grid>
                    </Grid>
                </Container>

                <Container sx={{ marginTop: '50px' }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        <Typography mb={2} className="static-h2" variant="h2">About Mihidora</Typography>
                        <Typography mb={2} className="static-body" variant="body1" sx={{ textAlign: 'center' }}>
                            Welcome to Mihidora, where data, toolkits and resources for conservation and environmental initiatives reside on one convenient online platform.
                        </Typography>
                        {/* <Box sx={{ width: { lg: '70%', md: '100%' } }}>
                            <ul>
                                <li className="list-text">To effectively share knowledge and expertise to support environmental protection and sustainability. </li>
                                <li className="list-text">To connect different interest groups to consistently organise, mobilise, educate and campaign against environmental destruction. </li>
                                <li className="list-text">To promote awareness and projects that are vital for the sustainability of the country’s environment. </li>
                                <li className="list-text">To influence environmental policy through the conducting of research and knowledge enhancement. </li>
                            </ul>
                        </Box> */}
                        {/* <Typography mb={2} className="static-body" variant="body1" sx={{ textAlign: 'center' }}>
                            Welcome to Mihidora, where data, toolkits, and resources for conservation and environmental initiatives reside on one convenient online platform.
                        </Typography> */}
                        <Typography mb={2} className="static-body" variant="body1" sx={{ textAlign: 'center' }}>
                            What we Offer
                        </Typography>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <ImportContactsIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Comprehensive Information" secondary="Find organizations, projects, events, studies, courses and resources to utilize, inspire, and assist you." />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <DevicesIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="User-Friendly Interface" secondary="Our website is designed with you in mind. Enjoy an intuitive and easy-to-navigate platform that ensures a seamless browsing experience." />
                            </ListItem>
                        </Stack>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <PeopleIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Community" secondary="Join a vibrant community of environmentalists and conservationists who share your interests and passions. Connect, learn, and grow together." />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <InsightsIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Expert Insights" secondary="Benefit from the knowledge and expertise of academics and local experts who provide valuable insights and advice." />
                            </ListItem>
                        </Stack>
                        <Stack direction="row" spacing={2} mt={3}>
                            <a className="banner-buttons" href="/register-as">Join Mihidora</a>
                            <a className="banner-buttons-outline" href="/projects">View Projects</a>
                        </Stack>
                    </Box>
                </Container>

                <Container sx={{ marginTop: '100px' }} className="featured-home">
                    <Grid sx={{ flexGrow: 1 }} container spacing={2}>
                        <Grid item lg={6}>
                            <a href="/projects">
                                <Box className="projectBox">
                                    <div className="project-img"></div>
                                    <Typography mt={2} className="static-h3" variant="h2">Projects & Organizations</Typography>
                                    <Typography mb={2} className="static-body" variant="body1" sx={{ textAlign: 'center' }}>
                                        Explore a diverse spectrum of environmental champions and impactful projects, fostering awareness and collaboration for a sustainable future.
                                    </Typography>
                                </Box>
                            </a>
                        </Grid>
                        <Grid item lg={6}>
                            <Stack spacing={2}>
                                <a href="/datahub">
                                    <Box className="feature-box">
                                        <Grid sx={{ flexGrow: 1 }} container>
                                            <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                                                <div className="data-box-img"></div>
                                            </Grid>
                                            <Grid item xs={9}>
                                                <Typography className="static-h3" variant="h3">Data Hub</Typography>
                                                <Typography mb={2} className="static-body" variant="body1" sx={{ textAlign: 'left' }}>
                                                    Unlock the power of environmental data with our DataHub, where users can contribute and discover datasets, fueling informed decisions for a greener world.
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </a>
                                <a href="/resource-exchange/jobs">
                                    <Box className="feature-box">
                                        <Grid sx={{ flexGrow: 1 }} container>
                                            <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                                                <div className="resource-box-imag"></div>
                                            </Grid>
                                            <Grid item xs={9}>
                                                <Typography className="static-h3" variant="h3">Resource Exchange</Typography>
                                                <Typography mb={2} className="static-body" variant="body1" sx={{ textAlign: 'left' }}>
                                                    Join the Resource Exchange to share and discover a wealth of tools, materials, and expertise, empowering collective efforts in safeguarding the environment.
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </a>
                                <a href="/elearning-materials">
                                    <Box className="feature-box">
                                        <Grid sx={{ flexGrow: 1 }} container>
                                            <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                                                <div className="elearning-box-img"></div>
                                            </Grid>
                                            <Grid item xs={9}>
                                                <Typography className="static-h3" variant="h3">E-learning</Typography>
                                                <Typography mb={2} className="static-body" variant="body1" sx={{ textAlign: 'left' }}>
                                                    With our E-Learning hub, users can curate and explore a diverse range of educational materials, fostering a community of informed stewards for our planet
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </a>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>

                <Container sx={{ marginTop: '100px' }}>
                    <Grid container sx={{ mb: 4 }}>
                        <Grid item xs={12}>
                            <Typography sx={{ textAlign: 'center' }} className="static-h2" variant="h2">Latest Projects</Typography>
                        </Grid>
                    </Grid>
                    {projectLoad ? <ListSkeleton8 /> :
                        <Grid container spacing={2}>
                            {projectList.map((project, key) => (
                                <Grid item key={key} xs={12} md={4} lg={3} className="organization_card" >
                                    <Link style={{
                                        height: "100%",
                                        display: 'block',
                                        border: '1px solid #ececec',
                                        borderRadius: '10px'
                                    }} to={`/project/` + project.slug}>
                                        {project.photos.length !== 0 ?
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={`/storage/` + JSON.parse(project.photos)[0]}
                                                onError={handleImageError}
                                                alt="green iguana"
                                                loading="lazy"
                                            />
                                            :
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image="../../../images/project.jpg"
                                                alt="green iguana"
                                                loading="lazy"
                                            />
                                        }
                                        <CardContent className="card_content project-card">
                                            {/* <Typography variant="span" className="main-tag">{project.tags[0].name}</Typography> */}
                                            <Typography variant="h6" className="card-title">{project.project_title}</Typography>
                                            <Typography variant="subtitle" className="card-body">
                                                {project.overview !== null ? project.overview.substring(0, 50) : ''}
                                            </Typography>
                                            <ul className="related-tags">

                                                {project.tags.length !== 0 ?
                                                    <li><Link to=''>
                                                        <Chip sx={{ marginTop: '5px', backgroundColor: '#edf7c9' }} label={project.tags[0].name.substring(0, 20)} />
                                                    </Link></li>
                                                    : ''}
                                            </ul>
                                        </CardContent>
                                    </Link>
                                </Grid>
                            ))}
                        </Grid>
                    }
                    <Grid container sx={{ mb: 4, mt: 4 }}>
                        <Grid item xs={12} sx={{ textAlign: 'center' }}>
                            <a className="banner-buttons-outline" href="/projects">View All Projects</a>
                        </Grid>
                    </Grid>
                </Container>

                <Container sx={{ marginTop: '100px' }}>
                    <Grid container sx={{ mb: 4 }}>
                        <Grid item xs={12}>
                            <Typography sx={{ textAlign: 'center' }} className="static-h2" variant="h2">What's On</Typography>
                        </Grid>
                    </Grid>

                    <Grid sx={{ flexGrow: 1 }} container spacing={3}>
                        <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <a href="/whatson/events" style={{ color: 'inherit !important' }}>
                                <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div className="home-thumb-box" style={{ backgroundImage: `url(${"../../../images/events-home.png"})` }} ></div>
                                    <Typography className="static-h3" variant="h3" sx={{ color: 'black' }} pt={2}>Events</Typography>
                                    <Typography mb={2} className="static-body" variant="body1" sx={{ textAlign: 'center', color: 'black' }}>
                                        Dive into impactful experiences by exploring our Events Tab, where passion meets purpose for a sustainable tomorrow.
                                    </Typography>
                                </Box>
                            </a>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <a href="/whatson/volunteer-opportunities" style={{ color: 'inherit !important' }}>
                                <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div className="home-thumb-box" style={{ backgroundImage: `url(${"../../../images/volunteer-home.png"})` }} ></div>
                                    <Typography className="static-h3" variant="h3" sx={{ color: 'black' }} pt={2}>Volunteer Oppurtunities</Typography>
                                    <Typography mb={2} className="static-body" variant="body1" sx={{ textAlign: 'center', color: 'black' }}>
                                        Transform passion into action by checking out our Volunteer Opportunities Section, offering meaningful chances to contribute and make a hands-on difference in the journey towards an eco-friendly future.
                                    </Typography>
                                </Box>
                            </a>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <a href="/whatson/media-and-advocacy" style={{ color: 'inherit !important' }}>
                                <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div className="home-thumb-box" style={{ backgroundImage: `url(${"../../../images/media-advocacy-home.png"})` }} ></div>
                                    <Typography className="static-h3" variant="h3" sx={{ color: 'black' }} pt={2}>Media & Advocacy</Typography>
                                    <Typography mb={2} className="static-body" variant="body1" sx={{ textAlign: 'center', color: 'black' }}>
                                        Elevate your voice in our Media & Advocacy Section, where compelling stories and influential campaigns converge to drive change, amplifying the call for a greener, brighter Sri Lanka.
                                    </Typography>
                                </Box>
                            </a>
                        </Grid>
                    </Grid>

                </Container>

                <Container sx={{ marginTop: '100px' }}>
                    <Grid container sx={{ mb: 4 }}>
                        <Grid item xs={12}>
                            <Typography sx={{ textAlign: 'center' }} className="static-h2" variant="h2">Upcoming Events</Typography>
                        </Grid>
                    </Grid>
                    {eventLoad ? <ListSkeleton8 /> :
                        <Grid container spacing={2}>
                            {eventList.map((project, key) => (
                                <Grid item key={key} xs={12} md={4} lg={3} className="organization_card" >
                                    <Link style={{
                                        height: "100%",
                                        display: 'block',
                                        border: '1px solid #ececec',
                                        borderRadius: '10px'
                                    }} to={`/project/` + project.slug}>
                                        {JSON.parse(project.photos) !== null ?
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={`/storage/` + JSON.parse(project.photos)[0]}
                                                onError={handleImageError}
                                                alt="green iguana"
                                            />
                                            :
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image="../../../images/project.jpg"
                                                alt="green iguana"
                                            />
                                        }
                                        <CardContent className="card_content project-card">
                                            {/* <Typography variant="span" className="main-tag">{project.tags[0].name}</Typography> */}
                                            <Typography variant="h6" className="card-title">{project.title} </Typography>
                                            <Typography variant="subtitle" className="card-body">
                                                {project.overview !== null ? project.overview.substring(0, 50) : ''}
                                            </Typography>
                                            <ul className="related-tags">

                                                {project.tags.length !== 0 ?
                                                    <li><Link to=''>
                                                        <Chip sx={{ marginTop: '5px', backgroundColor: '#edf7c9' }} label={project.tags[0].name.substring(0, 20)} />
                                                    </Link></li>
                                                    : ''}
                                            </ul>
                                        </CardContent>
                                    </Link>
                                </Grid>
                            ))}
                        </Grid>
                    }
                    <Grid container sx={{ mb: 4, mt: 4 }}>
                        <Grid item xs={12} sx={{ textAlign: 'center' }}>
                            <a className="banner-buttons-outline" href="/whatson/events">View All Events</a>
                        </Grid>
                    </Grid>
                </Container>

                {/* <Container sx={{ marginTop: '100px' }}>
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
                            <Typography className="static-h3" variant="h3" sx={{mb:1}}>Mihidora is an initiative by FEO</Typography>
                            <Typography mb={2} className="static-body" variant="body1" sx={{ textAlign: 'left' }}>
                                To effectively share knowledge and expertise to support environmental protection and sustainability. To connect different interest groups to consistently organize, mobilize, educate and campaign against environmental destruction To promote awareness and projects that are vital for the sustainability of the country’s environment. To Influence environmental policy through the conducting of research and knowledge enhancement.
                            </Typography>
                            <a href="https://feosrilanka.org/" >Read more...</a>
                        </Grid>
                    </Grid>
                </Container> */}

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

export default HomeNew