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
    Divider,
    Dialog,
    DialogContent,
    DialogTitle,
    Toolbar,
    IconButton,
} from "@mui/material";
import { Close as CloseIcon } from '@mui/icons-material';
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
import LocationCityIcon from '@mui/icons-material/LocationCity';
import AddButton from '../components/AddButton';
import FMap from '../components/Map/FMap';
import PublicSubscriptionComponent from '../components/PublicSubscriptionComponent';
import PublicSubscriptionAll from '../components/PublicSubscriptionAll';

function ResourcesRFPNew() {
    const [projectList, setProjectList] = useState([]);
    const [projectLoad, setProjectLoad] = useState(true);
    const [dataList, setDataList] = useState([]);
    const [dataLoad, setDataLoad] = useState(true);
    const [open, setOpen] = useState(false);
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
        sortBy: '',
        district: '',
    })
    // handles subject & extra tags, multi select filters
    const [otherTags, setOtherTags] = useState({
        subject: [],
        extra: [],
    })
    // Results
    const [loading, setloading] = useState(true);
    const [districts, setDistricts] = useState([]);

    useEffect(() => {
        loadProjects({ skip: 0, take: 50, type: 2 });
        loadDistricts();
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
            axios.post('/api/get-classified-list', data).then(res => {
                console.log(res)
                if (res.status == 200) {
                    setProjectList(res.data.results);
                    setProjectLoad(false);
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
            axios.post('/api/filter-resources', data).then(res => {
                console.log(res)
                if (res.status == 200) {
                    setProjectList(res.data.resources);
                    setProjectLoad(false);
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
        console.log(e.target.value);
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
        let data = [
            state.level1,
            state.level2,
            state.level3,
            state.level4,
            ...otherTags.subject.map((option) => option.id),
            ...otherTags.extra.map((option) => option.id),
        ]
        filterProjects({ filters: data, district: e.target.value, type: 2 });
    }

    const loadDistricts = () => {
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.get('/api/districts').then(res => {
                console.log(res)
                if (res.status == 200) {
                    setDistricts(res.data.districts);
                } else {
                    // handle the error
                    setProjectLoad(false);
                }
            });
        });
    }

    const handleImageError = (event) => {
        event.target.src = '../../../images/project-default.jpg'; // Set the fallback image URL
    };

    const handleImageErrorData = (event) => {
        event.target.src = '../../../images/data-default.jpg'; // Set the fallback image URL
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {

            if (event.target.value === null || event.target.value.trim() === '') {
                loadProjects({ skip: 0, take: 50, type: 2 });
                return;
            }
            search({ "term": event.target.value, type: 2 });
        }
    };

    const search = (data) => {
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post('/api/resource-search', data).then(res => {
                console.log(res)
                if (res.status == 200) {
                    setProjectList(res.data.results);
                    setProjectLoad(false);
                } else {
                    // handle the error
                    setProjectLoad(false);
                }
            });
        });
    }

    const handleDrawerOpen = () => {
        // loadProjects({ skip: 0, take: 50 });
        setOpen(true);
    }


    const handleClose = () => {
        setOpen(false);
    };

    const menuIcon = {
        color: '#c4c4c4',
        fontSize: 18,
        float: 'left',
        margin: '4px 5px 0px 0px'
    }


    return (
        <BaseLayout title={"Topic"}>

            <div className="topic-title-section">
                <Container>
                    <Grid container>
                        <Grid item sm={12} md={6} lg={6}>
                            <Typography sx={{ fontSize: '12px' }}>Resource Exchange</Typography>
                            <Typography variant="h1">Grants & RFPs</Typography>
                            {/* <PublicSubscriptionComponent topic="grants" title="Grants & RFPs" /> */}
                            <PublicSubscriptionAll topic="All Topics" title="All Topics" />
                        </Grid>
                        <Grid item sm={12} md={6} lg={6}>
                            <div className="section-links">
                                <div style={{ marginRight: '20px' }}><ProjectLink name="Jobs" link={'/resource-exchange/jobs'} icon={<NaturePeopleIcon fontSize="small" className="iconActive" />} /></div>
                                <div style={{ marginRight: '20px' }}><ProjectLink visited name="Grants & RFPs" link={'/resource-exchange/grants-and-proposals'} icon={<NaturePeopleIcon fontSize="small" className="iconVisited" />} /></div>
                                <div style={{ marginRight: '20px' }}><ProjectLink name="Suppliers" link={'/resource-exchange/suppliers'} icon={<TextSnippetIcon fontSize="small" className="iconActive" />} /></div>
                                <div style={{ marginRight: '20px' }}><ProjectLink name="Resource Pool" link={'/resource-exchange/resource-sharing'} icon={<ArchitectureIcon fontSize="small" className="iconActive" />} /></div>
                            </div>
                        </Grid>
                    </Grid>
                </Container>
            </div>

            <Container sx={{ mb: 2 }} className="filter_forms">
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
                    name="search"
                    onKeyDown={handleKeyPress}
                />
                <Grid container mt={3}>
                    <Grid item sm={12} md={6}>
                        {/* <Typography>Filter through tags & find the type of projects you are looking for</Typography> */}
                    </Grid>
                    <Grid item sm={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <AddButton
                            title="Do you work on environmental issues in Sri Lanka"
                            link="/add-classified"
                            linkLabel="Add Grants" />
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
                    <Grid item sx={{ textAlign: 'right', alignSelf: 'end' }} xs>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            paddingTop: '20px',
                        }}>
                            <PlaceIcon sx={{ mr: 2, cursor: 'pointer', fontSize: 32 }} onClick={handleDrawerOpen} />
                        </div>
                    </Grid>
                </Grid>

            </Container>

            {/* ------------------ projects --------------------- */}

            <div id="datasets" className="topic-sub-section">
                <Container>

                    <Grid container>
                        <Grid item xs={6}>
                            <Typography variant="h4" className="section-title">Grants & RFPs</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'right' }}>

                        </Grid>
                    </Grid>
                    {projectLoad ? <ListSkeleton8 /> :
                        <Grid container spacing={2}>
                            {projectList.map((project, key) => (
                                <Grid item key={key} xs={3} className="organization_card" >
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

                                                {project.district ?
                                                    <li><Link to=''>
                                                        <Chip sx={{ marginTop: '5px', backgroundColor: '#edf7c9' }} label={project.district.name_en.substring(0, 50)} />
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
            <Dialog fullScreen open={open} onClose={handleClose} disableEnforceFocus>
                <DialogTitle>
                    <Typography variant="h6">Full Screen Dialog</Typography>
                    <IconButton sx={{ position: 'absolute', right: '20px', top: '10px', zIndex: 2000 }} edge="end" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent disablePadding sx={{ paddingLeft: '0px', paddingRight: '0px' }}>
                    <FMap topic={'resource-exchange-proposal'} />
                </DialogContent>
            </Dialog>
        </BaseLayout>
    )
}
export default ResourcesRFPNew
