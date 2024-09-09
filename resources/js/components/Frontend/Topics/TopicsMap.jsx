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
    MenuItem,
    InputLabel,
    Divider
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
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ProjectLink from '../components/ProjectLink';
import ClusteredMap from '../ResourceExchange/ClusteredMap';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import LocationSearch from '../ResourceExchange/LocationSearch';
function TopicsMap() {
    const [projectList, setProjectList] = useState([]);
    const [projectLoad, setProjectLoad] = useState(true);
    const [dataList, setDataList] = useState([]);
    const [dataLoad, setDataLoad] = useState(true);

    const [elearningList, setElearningList] = useState([]);
    const [eventList, setEventList] = useState([]);

    // Filters
    const [subjectTags, setSubjectTags] = useState([]); // holds subject tag list for the filter
    const [extraTags, setExtraTags] = useState([]); // holds extra tag list for the filter
    const [l1tags, setL1tags] = useState([]);
    const [l2tags, setL2tags] = useState([]);
    const [l3tags, setL3tags] = useState([]);
    const [l4tags, setL4tags] = useState([]);
    const [locations, setLocations] = useState([]);
    // handles thematic tags and other single select filters
    const [state, setState] = useState({
        level1: '',
        level2: '',
        level3: '',
        level4: '',
        location: '',
        sortBy: ''
    })
    // handles subject & extra tags, multi select filters
    const [otherTags, setOtherTags] = useState({
        subject: [],
        extra: [],
    })
    // Results
    const [loading, setloading] = useState(true);
    const [markers, setMarkers] = useState([
        { lat: 6.868541278372921, lng: 80.40345948463631, text: 'Marker 1', open: false },
        { lat: 6.866630116539684, lng: 80.41462432852182, text: 'Marker 2', open: false },
        { lat: 6.8652285929828345, lng: 80.40596194964513, text: 'Marker 3', open: false },
    ]);
    const [mapConfigs, setMapConfigs] = useState({
        center: { lat: 7.491214239209488, lng: 80.71736087951162 },
        zoom: 9,
        open: false,
    })
    const [selectedPlaces, setSelectedPlaces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const handlePlacesChanged = (places) => {
        console.log(places);
        setSelectedPlaces(places);
    };

    const navigate = useNavigate();

    useEffect(() => {
        loadProjects({ skip: 0, take: 50 });
        loadTags({ level: 1 }); // load level 1 tags
        loadTags({ level: 10 }); // load subject tags
        loadTags({ level: 11 }); // load extra tags
    }, []);

    const filterResults = () => {
        console.log(state);
        console.log(otherTags);
        let data = [
            state.level1,
            state.level2,
            state.level3,
            state.level4,
            ...otherTags.subject.map((option) => option.id),
            ...otherTags.extra.map((option) => option.id),
        ]
        console.log(data);
    }

    const loadTags = (data) => {
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post('/api/get-tags', data).then(res => {
                console.log(res)
                if (res.status == 200) {
                    if (data.level == 1) {
                        setL1tags(res.data.tags);
                    }
                    if (data.level == 2) {
                        setL2tags(res.data.tags);
                    }
                    if (data.level == 3) {
                        setL3tags(res.data.tags);
                    }
                    if (data.level == 4) {
                        setL4tags(res.data.tags);
                    }
                    if (data.level == 10) {
                        setSubjectTags(res.data.tags);
                    }
                    if (data.level == 11) {
                        setExtraTags(res.data.tags);
                    }
                } else {
                    // handle the error
                }
            });
        });
    }
    const loadProjects = (data) => {
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post('/api/get-projects', data).then(res => {
                console.log(res)
                if (res.status == 200) {
                    setProjectList(res.data.projects);
                    setProjectLoad(false);
                    let markers = res.data.projects.filter((project) => {
                        let cords = JSON.parse(project.locations);
                        if (cords.length > 0) {
                            return {
                                cords: JSON.parse(project.locations),
                                text: project.project_title
                            };
                        }
                    });
                    //setMarkers(markers);
                    let filtered = markers.map((marker) => {
                        let cords = JSON.parse(marker.locations);
                        return {
                            lat: cords[0].lat,
                            lng: cords[0].lng,
                            text: marker.project_title,
                            overview: marker.overview != null ? marker.overview.substring(0, 50) : marker.overview,
                            url: `/project/${marker.slug}`
                        }
                    })
                    setMarkers(filtered);
                } else {
                    // handle the error
                    setProjectLoad(false);
                }
            });
        });
    }
    const filterProjects = (data) => {
        setProjectLoad(true);
        setDataLoad(true);
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post('/api/filter-topics', data).then(res => {
                console.log(res)
                if (res.status == 200) {
                    setProjectList(res.data.projects);
                    setProjectLoad(false);
                    setDataList(res.data.data);
                    setDataLoad(false);
                    let markers = res.data.projects.filter((project) => {
                        let cords = JSON.parse(project.locations);
                        if (cords.length > 0) {
                            return {
                                cords: JSON.parse(project.locations),
                                text: project.project_title
                            };
                        }
                    });
                    //setMarkers(markers);
                    let filtered = markers.map((marker) => {
                        let cords = JSON.parse(marker.locations);
                        return {
                            lat: cords[0].lat,
                            lng: cords[0].lng,
                            text: marker.project_title,
                            overview: marker.overview != null ? marker.overview.substring(0, 50) : marker.overview,
                            url: `/project/${marker.slug}`
                        }
                    })
                    setMarkers(filtered);
                    // change the map center;
                    if (filtered.length > 0) {
                        setMapConfigs({
                            zoom: 12, center: { lat: filtered[0].lat, lng: filtered[0].lng }
                        });
                    }
                } else {
                    // handle the error
                    setProjectLoad(false);
                }
            });
        });
    }

    // input handlers
    const handleL1Change = (e) => {
        setState({
            ...state,
            level1: e.target.value,
            level2: '',
            level3: '',
            level4: ''
        })
        loadTags({ level: 2, parent: e.target.value });
        let data = [
            e.target.value,
            ...otherTags.subject.map((option) => option.id),
            ...otherTags.extra.map((option) => option.id),
        ]
        console.log(data);
        filterProjects({ filters: data, take: 50 });
    }
    const handleL2Change = (e) => {
        setState({
            ...state,
            level2: e.target.value,
            level3: '',
            level4: ''
        })
        loadTags({ level: 3, parent: e.target.value });
        let data = [
            state.level1,
            e.target.value,
            ...otherTags.subject.map((option) => option.id),
            ...otherTags.extra.map((option) => option.id),
        ]
        filterProjects({ filters: data, take: 50 });
    }
    const handleL3Change = (e) => {
        setState({
            ...state,
            level3: e.target.value,
            level4: ''
        })
        loadTags({ level: 4, parent: e.target.value });
        let data = [
            state.level1,
            state.level2,
            e.target.value,
            ...otherTags.subject.map((option) => option.id),
            ...otherTags.extra.map((option) => option.id),
        ]
        filterProjects({ filters: data, take: 50 });
    }
    const handleL4Change = (e) => {
        setState({
            ...state,
            level4: e.target.value,
        })
        let data = [
            state.level1,
            state.level2,
            state.level3,
            e.target.value,
            ...otherTags.subject.map((option) => option.id),
            ...otherTags.extra.map((option) => option.id),
        ]
        filterProjects({ filters: data, take: 50 });
    }
    const handleSujectTagChange = (event, newValue) => {
        setOtherTags({ ...otherTags, subject: newValue });
        let data = [
            state.level1,
            state.level2,
            state.level3,
            state.level4,
            ...newValue.map((option) => option.id),
            ...otherTags.extra.map((option) => option.id),
        ]
        filterProjects({ filters: data, take: 50 });
    }
    const handleExtraTagSelect = (event, newValue) => {
        setOtherTags({ ...otherTags, extra: newValue });
        let data = [
            state.level1,
            state.level2,
            state.level3,
            state.level4,
            ...otherTags.subject.map((option) => option.id),
            ...newValue.map((option) => option.id),
        ]
        filterProjects({ filters: data, take: 50 });
    }
    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    }

    const handleImageError = (event) => {
        event.target.src = '../../../images/project-default.jpg'; // Set the fallback image URL
    };

    const handleImageErrorData = (event) => {
        event.target.src = '../../../images/data-default.jpg'; // Set the fallback image URL
    };

    const menuIcon = {
        color: '#c4c4c4',
        fontSize: 18,
        float: 'left',
        margin: '4px 5px 0px 0px'
    }

    const handleListClick = () => {
        navigate("/topics");
    }

    return (
        <BaseLayout title={"Topic"}>

            <div className="topic-title-section">
                <Container>
                    <Grid container>
                        <Grid item sm={12} md={6} lg={6}>
                            <Typography variant="h1">Topics</Typography>
                        </Grid>
                        <Grid item sm={12} md={6} lg={6}>
                            <div className="section-links">
                                <div style={{ marginRight: '20px' }}><ProjectLink name="Projects" link={'/projects'} icon={<NaturePeopleIcon fontSize="small" className="iconActive" />} /></div>
                                <div style={{ marginRight: '20px' }}><ProjectLink name="Data" link={'/datahub'} icon={<TextSnippetIcon fontSize="small" className="iconActive" />} /></div>
                                <div style={{ marginRight: '20px' }}><ProjectLink name="Resources" link={'/resource-exchange'} icon={<ArchitectureIcon fontSize="small" className="iconActive" />} /></div>
                                <div style={{ marginRight: '20px' }}><ProjectLink name="E-Learning" link={'/elearning-materials'} icon={<AutoStoriesIcon fontSize="small" className="iconActive" />} /></div>
                                <div style={{ marginRight: '20px' }}><ProjectLink name="Events" link={'/projects'} icon={<CalendarMonthIcon fontSize="small" className="iconActive" />} /></div>
                            </div>
                        </Grid>
                    </Grid>
                </Container>
            </div>

            <Container className="filter_forms">
                <TextField className="searchbox" sx={{
                    '& .MuiInputBase-root-MuiOutlinedInput-root': {
                        borderRadius: '30px'
                    }
                }} fullWidth placeholder="Search using tags: energy, water etc..." id="fullWidth" size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="end" sx={{
                                borderRadius: '30px',
                                '& .MuiInputBase-root-MuiOutlinedInput-root': {
                                    borderRadius: '30px'
                                }
                            }}>
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                />
                <Grid container mt={3}>
                    <Grid item sm={12} md={6}>
                        <Typography>Filter through tags & find the type of projects you are looking for</Typography>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item sm={12} md={6}>
                        <Typography sx={{ fontSize: '12px' }} mt={3}>Thematic Tags</Typography>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item>
                        <FormControl sx={{ minWidth: 200, mt: 0 }} size="small" variant="standard">
                            <InputLabel id="demo-simple-select-label">Tags level 1</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                name="level1"
                                value={state.level1}
                                label="Tags level 1"
                                onChange={handleL1Change}
                                sx={{
                                    '& .MuiBackdrop-root': {
                                        '&.Mui-focused': {
                                            color: '#93aa40'
                                        }
                                    }
                                }}
                            >
                                <MenuItem value={''}>None</MenuItem>
                                {l1tags.map((tag) => {
                                    return <MenuItem key={tag.slug} value={tag.id}>{tag.name}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </Grid>

                    {state.level1 != '' ?
                        <Grid item sx={{ ml: 2 }}>
                            <FormControl sx={{ minWidth: 200, mt: 0 }} size="small" variant="standard">
                                <InputLabel id="demo-simple-select-label">Tags level 2</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    name="level2"
                                    value={state.level2}
                                    label="Tags level 2"
                                    onChange={handleL2Change}
                                    sx={{
                                        '& .MuiBackdrop-root': {
                                            '&.Mui-focused': {
                                                color: '#93aa40'
                                            }
                                        }
                                    }}
                                >
                                    <MenuItem value={''}>None</MenuItem>
                                    {l2tags.map((tag) => {
                                        return <MenuItem key={tag.slug} value={tag.id}>{tag.name}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Grid> : ''}

                    {state.level2 != '' ?
                        <Grid item sx={{ ml: 2 }}>
                            <FormControl sx={{ minWidth: 200, mt: 0 }} size="small" variant="standard">
                                <InputLabel id="demo-simple-select-label">Tags level 3</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    name="level3"
                                    value={state.level3}
                                    label="Tags level 3"
                                    onChange={handleL3Change}
                                    sx={{
                                        '& .MuiBackdrop-root': {
                                            '&.Mui-focused': {
                                                color: '#93aa40'
                                            }
                                        }
                                    }}
                                >
                                    <MenuItem value={''}>None</MenuItem>
                                    {l3tags.map((tag) => {
                                        return <MenuItem key={tag.slug} value={tag.id}>{tag.name}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Grid> : ''}

                    {state.level3 != '' ?
                        <Grid item sx={{ ml: 2 }}>
                            <FormControl sx={{ minWidth: 200, mt: 0 }} size="small" variant="standard">
                                <InputLabel id="demo-simple-select-label">Tags level 4</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    name="level4"
                                    value={state.level4}
                                    label="Tags level 4"
                                    onChange={handleL4Change}
                                    sx={{
                                        '& .MuiBackdrop-root': {
                                            '&.Mui-focused': {
                                                color: '#93aa40'
                                            }
                                        }
                                    }}
                                >
                                    <MenuItem value={''}>None</MenuItem>
                                    {l4tags.map((tag) => {
                                        return <MenuItem key={tag.slug} value={tag.id}>{tag.name}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Grid> : ''}

                </Grid>



                <Grid container>
                    <Grid item sm={12} md={6}>
                        <Typography sx={{ fontSize: '12px' }} mt={3}>Other Tags</Typography>
                    </Grid>
                </Grid>
                <Grid container>

                    <Grid item>
                        <FormControl sx={{ minWidth: 200, mt: 0 }} size="small" variant="standard">
                            <InputLabel id="demo-simple-select-label">Location</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                name="district"
                                value={state.district}
                                label="District"
                                onChange={handleChange}
                                sx={{
                                    '& .MuiBackdrop-root': {
                                        '&.Mui-focused': {
                                            color: '#93aa40'
                                        }
                                    }
                                }}
                            >
                                <MenuItem value={''}>None</MenuItem>
                                {districts.map((district) => {
                                    return <MenuItem key={district.id} value={district.id}>{district.name_en}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item sx={{ ml: 2 }}>
                        {/* Subject Tags */}
                        <FormControl sx={{ mt: 0 }} size="small" fullWidth>
                            <FormControl sx={{ minWidth: 200, maxWidth: 300 }} size="small">
                                <Autocomplete
                                    multiple
                                    limitTags={3}
                                    id="subject-tags"
                                    value={otherTags.subject}
                                    onChange={handleSujectTagChange}
                                    options={subjectTags}
                                    getOptionLabel={(option) => option.name}
                                    defaultValue={[]}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Subject Tags" variant="standard" size="small" />
                                    )}
                                />
                            </FormControl>
                        </FormControl>
                    </Grid>

                    <Grid item sx={{ ml: 2 }}>
                        <FormControl sx={{ mt: 0, minWidth: 200 }} size="small" fullWidth>
                            <Autocomplete
                                multiple
                                limitTags={3}
                                id="extra-tags"
                                value={otherTags.extra}
                                onChange={handleExtraTagSelect}
                                options={extraTags}
                                getOptionLabel={(option) => option.name}
                                defaultValue={[]}
                                renderInput={(params) => (
                                    <TextField {...params} label="Extra Tags" variant="standard" size="small" />
                                )}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item sx={{ textAlign: 'right', alignSelf: 'end' }} xs>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            paddingTop: '20px',
                        }}>
                            {/* <PlaceIcon sx={{ mr: 2, cursor: 'pointer', fontSize: 32 }} /> */}
                            <ListIcon sx={{ cursor: 'pointer', fontSize: 32 }} onClick={handleListClick} />
                        </div>
                    </Grid>
                </Grid>

            </Container>

            {/* ------------------ projects --------------------- */}

            <div id="datasets">
                <Container>
                    <Grid container>
                        <Grid item sx={{ width: '100%' }}>
                            <div style={{ height: '800px', width: '100%' }}>
                                <ClusteredMap
                                    googleMapURL={`https://maps.googleapis.com/maps/api/js?key=xxxxxxxxxxxxxx&v=3.exp&libraries=geometry,drawing,places`}
                                    // googleMapURL={`https://maps.googleapis.com/maps/api/staticmap?key=xxxxxxxxxxxxxx&center=47.65,-122.35&zoom=12&format=png&maptype=roadmap&style=element:geometry%7Ccolor:0xf5f5f5&style=element:labels.icon%7Cvisibility:off&style=element:labels.text.fill%7Ccolor:0x616161&style=element:labels.text.stroke%7Ccolor:0xf5f5f5&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0xbdbdbd&style=feature:poi%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:poi.park%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:road%7Celement:geometry%7Ccolor:0xffffff&style=feature:road.arterial%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:road.highway%7Celement:geometry%7Ccolor:0xdadada&style=feature:road.highway%7Celement:labels.text.fill%7Ccolor:0x616161&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:transit.line%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:transit.station%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:water%7Celement:geometry%7Ccolor:0xc9c9c9&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&size=480x360`}
                                    loadingElement={<div style={{ height: `100%` }} />}
                                    containerElement={<div style={{ height: `100%` }} />}
                                    mapElement={<div style={{ height: `100%` }} />}
                                    markers={markers}
                                    settings={mapConfigs}
                                />
                            </div>
                        </Grid>
                    </Grid>
                </Container>
            </div>

        </BaseLayout>
    )
}

export default TopicsMap
