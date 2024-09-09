import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    MenuItem,
    InputLabel,
    Divider
} from "@mui/material";
import Chip from '@mui/material/Chip';
import ListSkeleton8 from '../components/ListSkeleton8';

function ResourcesByOrg(props) {
    const [projectLoad, setProjectLoad] = useState(false);
    const [projectList, setProjectList] = useState([]);

    const getOrganisationProjects = () => {
        axios.get(`/api/organization-profile-classified/${props.slug}`).then(res => {
            if (res.data.status === 200) {
                setProjectList(res.data.classifieds);
            }
            else if (res.data.status === 404) {
                console.log(res.message);
            }
        });
    }

    const handleImageError = (event) => {
        event.target.src = '../../../images/project-default.jpg'; // Set the fallback image URL
    };

    useEffect(() => {
        getOrganisationProjects();
        console.log('projects loaded');
    }, []);


    //  * Type 1 : Job Advert
    //  * Type 2 : Grants & RFPs
    //  * Type 3 : Green / Sustainable Suppliers
    //  * Type 4 : Resource Pool


    return (
        <div id="datasets">
            <Container>
                {projectLoad ? <ListSkeleton8 /> :
                    <Grid container spacing={2}>
                        {projectList.map((project, key) => (
                            <Grid item key={key} xs={12} md={6} lg={3} className="organization_card" >
                                {project.type === 1 ? (
                                    <Link style={{
                                        height: "100%",
                                        display: 'block',
                                        border: '1px solid #ececec',
                                        borderRadius: '10px'
                                    }} to={`/resource-exchange-job/` + project.slug}>
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
                                            <Typography variant="h6" className="card-title">{project.title}</Typography>
                                            <Typography variant="subtitle" className="card-body">
                                                {project.overview !== null ? project.overview.substring(0, 50) : ''}
                                            </Typography>
                                            <ul className="related-tags">

                                                {/* {project.tags.length !== 0 ?
                                                    <li><Link to=''>
                                                        <Chip sx={{ marginTop: '5px', backgroundColor: '#edf7c9' }} label={project.tags[0].name.substring(0, 20)} />
                                                    </Link></li>
                                                    : ''} */}
                                            </ul>
                                        </CardContent>
                                    </Link>
                                ) : ('')}

                                {project.type === 2 ? (
                                    <Link style={{
                                        height: "100%",
                                        display: 'block',
                                        border: '1px solid #ececec',
                                        borderRadius: '10px'
                                    }} to={`/resource-exchange-proposal/` + project.slug}>
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
                                            <Typography variant="h6" className="card-title">{project.title}</Typography>
                                            <Typography variant="subtitle" className="card-body">
                                                {project.overview !== null ? project.overview.substring(0, 50) : ''}
                                            </Typography>
                                            <ul className="related-tags">

                                                {/* {project.tags.length !== 0 ?
                                                    <li><Link to=''>
                                                        <Chip sx={{ marginTop: '5px', backgroundColor: '#edf7c9' }} label={project.tags[0].name.substring(0, 20)} />
                                                    </Link></li>
                                                    : ''} */}
                                            </ul>
                                        </CardContent>
                                    </Link>
                                ) : ('')}

                                {project.type === 3 ? (
                                    <Link style={{
                                        height: "100%",
                                        display: 'block',
                                        border: '1px solid #ececec',
                                        borderRadius: '10px'
                                    }} to={`/resource-exchange-supplier/` + project.slug}>
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
                                            <Typography variant="h6" className="card-title">{project.title}</Typography>
                                            <Typography variant="subtitle" className="card-body">
                                                {project.overview !== null ? project.overview.substring(0, 50) : ''}
                                            </Typography>
                                            <ul className="related-tags">

                                                {/* {project.tags.length !== 0 ?
                                                    <li><Link to=''>
                                                        <Chip sx={{ marginTop: '5px', backgroundColor: '#edf7c9' }} label={project.tags[0].name.substring(0, 20)} />
                                                    </Link></li>
                                                    : ''} */}
                                            </ul>
                                        </CardContent>
                                    </Link>
                                ) : ('')}

                                {project.type === 4 ? (
                                    <Link style={{
                                        height: "100%",
                                        display: 'block',
                                        border: '1px solid #ececec',
                                        borderRadius: '10px'
                                    }} to={`/resource-exchange-resource-sharing/` + project.slug}>
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
                                            <Typography variant="h6" className="card-title">{project.title}</Typography>
                                            <Typography variant="subtitle" className="card-body">
                                                {project.overview !== null ? project.overview.substring(0, 50) : ''}
                                            </Typography>
                                            <ul className="related-tags">

                                                {/* {project.tags.length !== 0 ?
                                                    <li><Link to=''>
                                                        <Chip sx={{ marginTop: '5px', backgroundColor: '#edf7c9' }} label={project.tags[0].name.substring(0, 20)} />
                                                    </Link></li>
                                                    : ''} */}
                                            </ul>
                                        </CardContent>
                                    </Link>
                                ) : ('')}


                            </Grid>
                        ))}
                    </Grid>
                }
                {
                    projectList.length == 0 ?
                        !projectLoad ? <Grid container>
                            <Grid item sm={12} md={6}>
                                <Typography sx={{ fontSize: '12px' }} mt={3}>No projects found for selected filters</Typography>
                            </Grid>
                        </Grid> : ''
                        : ''
                }
            </Container>
        </div>
    );
}

export default ResourcesByOrg;