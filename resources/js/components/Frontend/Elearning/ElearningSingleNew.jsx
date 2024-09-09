import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Container,
    Grid,
    Typography,
    Stack,
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
    Divider,
    Item
} from "@mui/material";
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import SettingsApplicationsOutlinedIcon from '@mui/icons-material/SettingsApplicationsOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import BaseLayout from "../BaseLayout";
// import TopicMenu from "./TopicMenu";
import SearchIcon from '@mui/icons-material/Search';
import PlaceIcon from '@mui/icons-material/Place';
import ListIcon from '@mui/icons-material/List';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import ListSkeleton8 from '../components/ListSkeleton8';
import Chip from '@mui/material/Chip';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import AddButton from '../components/AddButton';
import OrgLink from '../components/OrgLink';
import Skeleton from '@mui/material/Skeleton';
import ClusteredMap from '../ResourceExchange/ClusteredMap';
import moment from 'moment-timezone';
import LexicalEditorView from "../Elearning/LexicalEditorView";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import ExampleTheme from "../../Dashboard/LexicalEditor/themes/ExampleTheme";
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
// import Avatar from '@mui/material/Avatar';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RenderHTML from '../components/RenderHTML';


function ElearningSingleNew(props) {

    const postParams = useParams();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState({
        overview: '',
        description: ''
    });
    const [relatedContent, setRelatedContent] = useState([]);
    const [editorInitialConfig, setEditorInitialConfig] = useState([]);
    const [images, setImages] = useState([]);
    const [organization, setOrganization] = useState({
        title: 'Test',
        url: '/product/test',
        type: 'type',
        initial: 'M'
    })
    const [tags, setTags] = useState([]);
    const [misc, setMisc] = useState({
        addedDate: '',
        dateString: ''
    })
    const [markers, setMarkers] = useState([
        { lat: 6.868541278372921, lng: 80.40345948463631, text: 'Marker 1', open: false },
    ]);
    const [mapConfigs, setMapConfigs] = useState({
        center: { lat: 7.491214239209488, lng: 80.71736087951162 },
        zoom: 9,
        open: false,
    })

    //loaders
    const [loaders, setLoaders] = useState({
        title: true,
        organization: true,
        tags: true,
        locations: true,
        relatedContent: true,
    })

    const [learning, setLearning] = useState([]);
    const [content, setContent] = useState([]);
    const [files, setFiles] = useState([]);

    const orgTypes = [
        'None',
        'CSO/NGO',
        'Academia',
        'Research Institution',
        'Private sector',
        'Media',
        'Donor'
    ];

    useEffect(() => {
        setLoaders({
            title: true,
            organization: true,
            tags: true,
            locations: true,
            relatedContent: true,
        })
        stopLoaders();
        getProjectProfile();
        if (description.description) {
            editorConfig.editorState = description.description;
            setEditorInitialConfig(editorConfig);
        }
        getRelatedProjects({ skip: 0, take: 4 });
    }, [postParams.slug, localStorage.getItem('auth_id'), description.description]);


    // API Calls
    const getProjectProfile = () => {
        axios.get(`/api/elearning-list/${postParams.slug}`).then(res => {
            if (res.data.status === 200) {
                console.log(res.data);
                setTitle(res.data.profile.title);
                setDescription({
                    overview: res.data.profile.overview,
                    description: res.data.profile.description,
                })
                // set organization details;
                let name = Array.from(res.data.organization.org_name)[0];
                setOrganization({
                    initial: name.toUpperCase(),
                    url: '/organization/' + res.data.organization.slug,
                    type: orgTypes[res.data.organization.org_type],
                    name: res.data.organization.org_name,
                })

                // set images
                // get project tags
                console.log('Get Tags for ' +  res.data.profile.id);
                //getElearningTags({ id: res.data.profile.id });
                setTags(res.data.profile.tags);

                setImages(JSON.parse(res.data.profile.photos));
                console.log(JSON.parse(res.data.profile.photos));
                console.log(JSON.parse(res.data.profile.what_you_will_learn));
                setLearning(JSON.parse(res.data.profile.what_you_will_learn));
                setContent(JSON.parse(res.data.profile.contents));
                setFiles(JSON.parse(res.data.profile.uploads));
                
                // set other data
                const addedDateString = res.data.profile.created_at;
                const addedFormated = moment(addedDateString).format("YYYY/M/D");
                const visitorTime = moment.tz(res.data.profile.created_at, 'UTC').tz(moment.tz.guess());
                console.log(res.data.profile.created_at);
                setMisc({
                    addedDate: addedFormated,
                    dateString: visitorTime
                });

                // //set locations
                // let locations = JSON.parse(res.data.get_data.locations);
                // let markers = locations.map(marker => {
                //     return {
                //         lat: marker.lat,
                //         lng: marker.lng,
                //         text: title,
                //         open: false,
                //     }
                // });
                // setMarkers(markers);
                // // update the map center;
                // if (locations.length > 0) {
                //     setMapConfigs({
                //         center: { lat: locations[0].lat, lng: locations[0].lng },
                //         zoom: 12,
                //         open: false,
                //     });
                // }

            }
            else if (res.data.status === 404) {
                console.log(res.message);
            }
        });
    }

    //TODO:- Update the related project query logic and change this API;
    const getRelatedProjects = (data) => {
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post('/api/get-projects', data).then(res => {
                console.log(res)
                if (res.status == 200) {
                    setRelatedContent(res.data.projects);
                } else {
                    // handle the error
                }
            });
        });
    }

    const stopLoaders = () => {
        setTimeout(() => {
            setLoaders({
                title: false,
                organization: false,
                tags: false,
                locations: false,
            });
        }, 2000);
    }

    let editorConfig = {
        theme: ExampleTheme,
        onError(error) {
            throw error;
        },
        nodes: [
            HeadingNode,
            ListNode,
            ListItemNode,
            QuoteNode,
            CodeNode,
            CodeHighlightNode,
            TableNode,
            TableCellNode,
            TableRowNode,
            AutoLinkNode,
            LinkNode
        ],
        editable: false,
    };

    const handleImageError = (event) => {
        event.target.src = '../../../images/project-default.jpg'; // Set the fallback image URL
    };

    const handleImageErrorData = (event) => {
        event.target.src = '../../../images/data-default.jpg'; // Set the fallback image URL
    };

    const darkTheme = createTheme({ palette: { mode: 'dark' } });

    return (
        <BaseLayout title={"Topic"}>
            <div className="single-post-title-section">

                {/* Begin Header */}
                <Container>
                    <Grid container>
                        <Grid item sm={12} md={6} lg={6} mt={3}>
                            <Typography sx={{ fontSize: '12px' }}>E-Learning Material</Typography>
                        </Grid>
                        <Grid item sm={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            {/* <AddButton
                                title="Do you work on environmental issues in Sri Lanka"
                                link="/add-whatson"
                                linkLabel="Add Your Event" /> */}
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item sm={12} md={6} lg={8}>
                            {loaders.title ? (
                                <div>
                                    <Skeleton variant="text" sx={{ fontSize: '32px' }} />
                                    <Skeleton variant="text" width={'60%'} sx={{ fontSize: '32px' }} />
                                </div>
                            ) : (
                                <Typography variant="h1" sx={{ fontWeight: '500' }}>{title}</Typography>
                            )}
                        </Grid>
                    </Grid>
                    <Grid container>
                        {loaders.organization ? (
                            <Grid item sm={12} md={6} lg={8}>
                                <Skeleton variant="circular" width={40} height={40} />
                            </Grid>
                        ) : (
                            <Grid item sm={12} md={6} lg={8}>
                                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', display: 'flex' }}>
                                    <OrgLink initial={organization.initial} name={organization.name} visited link={organization.url} />
                                    <Typography sx={{ fontSize: '16px', borderLeft: 'solid 1px #777', paddingLeft: '16px' }}>{moment(misc.dateString).fromNow()}</Typography>
                                    {/* <Typography sx={{ fontSize: '16px', borderLeft: 'solid 1px #777', paddingLeft: '16px' }}>{misc.dateString}</Typography> */}
                                </Stack>
                            </Grid>
                        )}
                    </Grid>
                </Container>
                {/* End Patrick */}

                {/* Main Image */}
                <Container>
                    <Grid container mt={4}>
                        <Grid item xs>
                            {images.length > 0 ? (
                                <CardMedia
                                    component="img"
                                    height="400"
                                    image={`/storage/` + images[0]}
                                    alt="Project Image"
                                    loading="lazy"
                                />
                            ) : (
                                <CardMedia
                                    component="img"
                                    height="400"
                                    image={`../../../images/project-default.jpg`}
                                    alt="Project Image"
                                    loading="lazy"
                                />
                            )}

                        </Grid>
                    </Grid>
                </Container>
                {/* End Main Image */}

                <Container>
                    <Grid className="text-container" container mt={4}>
                        <Grid item xs={12}>
                            <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>Overview</Typography>
                        </Grid>
                        {loaders.title ? (
                            <Grid item xs={12}>
                                <Skeleton variant="text" sx={{ fontSize: '32px' }} />
                                <Skeleton variant="text" width={'60%'} sx={{ fontSize: '32px' }} />
                            </Grid>
                        ) : (
                            <Grid item xs={12}>
                                <Typography sx={{ fontSize: '16px' }}>
                                    {description.overview}
                                </Typography>
                            </Grid>
                        )}

                    </Grid>
                    <Grid className="text-container" container mt={4}>
                        <Grid item xs={12}>
                            <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>Description</Typography>

                        </Grid>
                        {loaders.title ? (
                            <Grid item xs={12}>
                                <Skeleton variant="text" sx={{ fontSize: '32px' }} />
                                <Skeleton variant="text" sx={{ fontSize: '32px' }} />
                                <Skeleton variant="text" sx={{ fontSize: '32px' }} />
                                <Skeleton variant="text" sx={{ fontSize: '32px' }} />
                                <Skeleton variant="text" width={'60%'} sx={{ fontSize: '32px' }} />
                            </Grid>
                        ) : (
                            <Grid item xs={12}>
                                {/* {editorInitialConfig.length !== 0 && <LexicalEditorView initialConfig={editorInitialConfig} />} */}
                                <RenderHTML data={description.description} />
                            </Grid>
                        )}
                    </Grid>

                    <Grid className="text-container" container mt={4}>
                        <Grid item xs={12}>
                            <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>What you will learn</Typography>

                        </Grid>
                        <Grid item xs={12}>
                            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                {learning.map((item) => (
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <DoneAllIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary="" secondary={item.what_you_will_learn} />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                    </Grid>

                    <Grid className="text-container" container mt={4}>
                        <Grid item xs={12}>
                            <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>Content</Typography>

                        </Grid>
                        <Grid item xs={12}>
                            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                {content.map((item) => (
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <FiberManualRecordIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary="" secondary={item.content} />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                    </Grid>

                    <Grid className="text-container" container mt={4}>
                        <Grid item xs={12}>
                            <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>Files</Typography>

                        </Grid>
                        <Grid item xs={12}>
                            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                {files.map((item) => (
                                    <a href={`/storage/`+item}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <FileDownloadIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary="" secondary={title} />
                                    </ListItem>
                                    </a>
                                ))}
                            </List>
                        </Grid>
                    </Grid>

                    <Grid className="text-container" container mt={4}>
                        <Grid item xs={12}>
                            <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>Tags</Typography>
                        </Grid>
                        {loaders.tags ? (
                            <Grid item xs={12}>
                                <Skeleton variant="text" width={'10%'} sx={{ fontSize: '32px' }} />
                            </Grid>
                        ) : (
                            <Grid item xs={12}>

                                <ul className="related-tags">
                                    {tags.map((tag) => (
                                        <li><Link to=''>
                                            <Chip sx={{ marginTop: '5px', backgroundColor: '#edf7c9' }} label={tag.name} />
                                        </Link></li>
                                    ))}

                                    {/* <li><Link to=''>
                                        <Chip sx={{ marginTop: '5px', backgroundColor: '#edf7c9' }} label={'Policy & Administration'} />
                                    </Link></li> */}
                                </ul>
                                {/* <ul className="related-tags">

                                    {project.tags.length !== 0 ?
                                        <li><Link to=''>
                                            <Chip sx={{ marginTop: '5px', backgroundColor: '#edf7c9' }} label={project.tags[0].name.substring(0, 20)} />
                                        </Link></li>
                                        : ''}
                                </ul> */}
                            </Grid>
                        )}
                    </Grid>


                </Container>

                {/* Begin Map */}
                {/* <Container>
                    <Grid container mt={4}>
                        <Grid item xs sx={{ height: '500px' }}>
                            <ClusteredMap
                                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=xxxxxxxxxxxxxx&v=3.exp&libraries=geometry,drawing,places`}
                                // googleMapURL={`https://maps.googleapis.com/maps/api/staticmap?key=xxxxxxxxxxxxxx&center=47.65,-122.35&zoom=12&format=png&maptype=roadmap&style=element:geometry%7Ccolor:0xf5f5f5&style=element:labels.icon%7Cvisibility:off&style=element:labels.text.fill%7Ccolor:0x616161&style=element:labels.text.stroke%7Ccolor:0xf5f5f5&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0xbdbdbd&style=feature:poi%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:poi.park%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:road%7Celement:geometry%7Ccolor:0xffffff&style=feature:road.arterial%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:road.highway%7Celement:geometry%7Ccolor:0xdadada&style=feature:road.highway%7Celement:labels.text.fill%7Ccolor:0x616161&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:transit.line%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:transit.station%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:water%7Celement:geometry%7Ccolor:0xc9c9c9&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&size=480x360`}
                                loadingElement={<div style={{ height: `100%` }} />}
                                containerElement={<div style={{ height: `100%` }} />}
                                mapElement={<div style={{ height: `100%` }} />}
                                markers={markers}
                                settings={mapConfigs}
                            />
                        </Grid>
                    </Grid>
                </Container> */}
                {/* End Map */}

                {/* Add project button */}
                <Container>
                    <Grid container mt={4}>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <AddButton
                                title="Do you work on environmental issues in Sri Lanka"
                                link="/add-elearning"
                                linkLabel="Add Material" />
                        </Grid>
                    </Grid>
                </Container>
                {/* End add project button */}

                {/* Related Content */}
                <Container>
                    <Grid container mt={4} mb={2}>
                        <Grid item xs={12}>
                            <Typography sx={{ fontSize: '16px', fontWeight: '600' }} >Similar Material</Typography>
                        </Grid>
                    </Grid>
                </Container>
                {/* End Related Content */}

            </div>

            <Container style={{ marginBottom: '24px' }}>
                {loaders.relatedContent ? <ListSkeleton8 /> :
                    <Grid container spacing={2}>
                        {relatedContent.map((project, key) => (
                            <Grid item key={key} xs={12} md={6} lg={3} className="organization_card" >
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
                {
                    relatedContent.length == 0 ?
                        !loaders.relatedContent ? <Grid container>
                            <Grid item sm={12} md={6}>
                                <Typography sx={{ fontSize: '12px' }} mt={3}>No projects found for selected filters</Typography>
                            </Grid>
                        </Grid> : ''
                        : ''
                }
            </Container>
        </BaseLayout>
    )
}

export default ElearningSingleNew
