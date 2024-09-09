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
  DialogContent, 
  DialogTitle,
  Toolbar,
  IconButton,
  Slide
} from "@mui/material";

import { Close as CloseIcon } from '@mui/icons-material';

import SettingsApplicationsOutlinedIcon from '@mui/icons-material/SettingsApplicationsOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import Drawer from '@mui/material/Drawer';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';

import MenuIcon from '@mui/icons-material/Menu';

import BaseLayout from "../BaseLayout";
import TopicMenu from "./TopicMenu";
import SearchIcon from '@mui/icons-material/Search';
import PlaceIcon from '@mui/icons-material/Place';
import ListIcon from '@mui/icons-material/List';
import Autocomplete from '@mui/material/Autocomplete';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Button from '@mui/material/Button';
import ListSkeleton from '../components/ListSkeleton';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import ProjectLink from '../components/ProjectLink';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import FullscreenSharpIcon from '@mui/icons-material/FullscreenSharp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import Chip from '@mui/material/Chip';
import ClusteredMap from '../ResourceExchange/ClusteredMap';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import FMap from '../components/Map/FMap';

const drawerWidth = '20%';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function TopicsList() {
  const [projectList, setProjectList] = useState([]);
  const [projectLoad, setProjectLoad] = useState(true);
  const [dataList, setDataList] = useState([]);
  const [dataLoad, setDataLoad] = useState(true);

  const [elearningList, setElearningList] = useState([]);
  const [elearningLoading, setElearningLoading] = useState(true);
  const [resourceList, setResourceList] = useState([]);
  const [jobList, setJobList] = useState([]);
  const [grantList, setGrantList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [resourceLoading, serResourceLoading] = useState(true);
  const [eventList, setEventList] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);


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
  const [mapState, setMapState] = useState(true);
  const [activeMarker, setActiveMarker] = useState(null)
  const [open, setOpen] = useState(false);
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
  const [districts, setDistricts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    loadProjects({ skip: 0, take: 4 });
    loadDataList({ skip: 0, take: 4, type: 1 });
    loadElearningList({ skip: 0, take: 4, type: 2 });
    loadResources({ skip: 0, take: 4, type: 4 });
    loadOtherResources({ skip: 0, take: 4});
    loadEventList({ skip: 0, take: 4, type: 3 });
    loadTags({ level: 1 }); // load level 1 tags
    loadTags({ level: 10 }); // load subject tags
    loadTags({ level: 11 }); // load extra tags
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

  const loadDataList = (data) => {
    axios.get('/sanctum/csrf-cookie').then(response => {
      axios.post('/api/get-e-learing-data', data).then(res => {
        console.log(res)
        if (res.status == 200) {
          setDataList(res.data.projects);
          setDataLoad(false);
        } else {
          // handle the error
          setDataLoad(false);
        }
      });
    });
  }

  const loadElearningList = (data) => {
    axios.get('/sanctum/csrf-cookie').then(response => {
      axios.post('/api/get-e-learing-data', data).then(res => {
        console.log(res)
        if (res.status == 200) {
          setElearningList(res.data.projects);
          setElearningLoading(false);
        } else {
          // handle the error
          setElearningLoading(false);
        }
      });
    });
  }

  const loadResources = (data) => {
    axios.get('/sanctum/csrf-cookie').then(response => {
      axios.post('/api/get-classified-v2', data).then(res => {
        console.log(res)
        if (res.status == 200) {
          setResourceList(res.data.classified);
          serResourceLoading(false);
        } else {
          // handle the error
          serResourceLoading(false);
        }
      });
    });
  }
  const loadOtherResources = (data) => {
    axios.get('/sanctum/csrf-cookie').then(response => {
      axios.post('/api/get-other-resources', data).then(res => {
        console.log(res)
        if (res.status == 200) {
          // setResourceList(res.data.classified);
          setJobList(res.data.jobs);
          setGrantList(res.data.grants);
          setSupplierList(res.data.suppliers);
          serResourceLoading(false);
        } else {
          // handle the error
          serResourceLoading(false);
        }
      });
    });
  }

  const loadEventList = (data) => {
    axios.get('/sanctum/csrf-cookie').then(response => {
      axios.post('/api/get-events-list', data).then(res => {
        console.log(res)
        if (res.status == 200) {
          setEventList(res.data.projects);
          setEventsLoading(false);
        } else {
          // handle the error
          setEventsLoading(false);
        }
      });
    });
  }

  const filterProjects = (data) => {
    setProjectLoad(true);
    setDataLoad(true);
    console.log(data);
    axios.get('/sanctum/csrf-cookie').then(response => {
      axios.post('/api/filter-topics', data).then(res => {
        console.log(res)
        if (res.status == 200) {
          console.log(state);
          setProjectList(res.data.projects);
          setProjectLoad(false);
          setDataList(res.data.data);
          setDataLoad(false);
          setElearningList(res.data.elearning);
          setElearningLoading(false);
          setResourceList(res.data.resources);
          serResourceLoading(false);
          setEventList(res.data.whatson);
          setEventsLoading(false);
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
    filterProjects({ filters: data, take: 4, district: state.district });
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
    filterProjects({ filters: data, take: 4, district: state.district });
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
    filterProjects({ filters: data, take: 4, district: state.district });
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
    filterProjects({ filters: data, take: 4, district: state.district });
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
    filterProjects({ filters: data, take: 4, district: state.district });
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
    filterProjects({ filters: data, take: 4, district: state.district });
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
    filterProjects({ filters: data, take: 4, district: e.target.value });
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

  const menuIconx = {
    color: '#c4c4c4',
    fontSize: 18,
    float: 'left',
    margin: '4px 5px 0px 0px'
  }
  const handleClickOpen = () => {
    // setOpen(true);
    navigate("/topics-map");
  };
  const handleDrawerOpen = () => {
    // loadProjects({ skip: 0, take: 50 });
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  };
  const windowHasClosed = (props, marker, e) => {
    setMapState(false);
  };

  const onMarkerClick = (props, marker, e) => {
    setActiveMarker(marker);
  }


  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuClicked = () => {
    console.log('Menu clicked');
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {

      if (event.target.value === null || event.target.value.trim() === '') {
        loadProjects({ skip: 0, take: 4 });
        loadDataList({ skip: 0, take: 4, type: 1 });
        loadElearningList({ skip: 0, take: 4, type: 2 });
        loadResources({ skip: 0, take: 4, type: 4 });
        loadEventList({ skip: 0, take: 4, type: 3 });
        return;
      }
      search({ "term": event.target.value });
    }
  };

  const search = (data) => {
    axios.get('/sanctum/csrf-cookie').then(response => {
      axios.post('/api/search-all', data).then(res => {
        console.log(res);
        if (res.status == 200) {
          //projects
          setProjectList(res.data.results.projects);
          setProjectLoad(false);
          //data
          setDataList(res.data.results.data);
          setDataLoad(false);
          //elearning
          setElearningList(res.data.results.elearning);
          setElearningLoading(false);
          //resources
          setResourceList(res.data.results.resources);
          serResourceLoading(false);
          //events
          setEventList(res.data.results.whatson);
          setEventsLoading(false);
        } else {
          // handle the error
          setProjectLoad(false);
        }
      });
    });
  }

  const drawer = (
    <div>
      <Toolbar className="map-toolBar" sx={{ backgroundColor: '#a8c255' }} />
      <Divider />
      <Grid container mt={3}>
        <Grid item>
          <Typography ml={2}>Quickly sort through different key words and find information on Mihidora</Typography>
        </Grid>
      </Grid>
      <List sx={{ px: '2rem' }}>
        <ListItem key='test' disablePadding>
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
        </ListItem>
        <ListItem key='tt2' disablePadding>
          {state.level1 != '' ?
            <Grid item sx={{ mt: 2 }}>
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
        </ListItem>
        <ListItem key='tt3' disablePadding>
          {state.level2 != '' ?
            <Grid item sx={{ mt: 2 }}>
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
        </ListItem>
        <ListItem key='tt4' disablePadding>
          {state.level3 != '' ?
            <Grid item sx={{ mt: 2 }}>
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
        </ListItem>
        <ListItem key='tt41' disablePadding>
          <Grid container>
            <Grid item sm={12} md={6}>
              <Typography sx={{ fontSize: '12px' }} mt={3}>Other Tags</Typography>
            </Grid>
          </Grid>
        </ListItem>
        <ListItem key='tt42' disablePadding>
          <Grid item sx={{ mt: 2 }}>
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
        </ListItem>
        <ListItem key='tt5' disablePadding>
          <Grid item sx={{ mt: 2 }}>
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
        </ListItem>
        <ListItem key='tt6' disablePadding>
          {/* <Link
            component="button"
            variant="body2"
          >
            Button Link
          </Link> */}
        </ListItem>
        <ListItem key='tt7' disablePadding>
          <Grid item sx={{ mt: 2 }}>
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
        </ListItem>
      </List>
    </div>
  );

  return (
    <BaseLayout title={"Topic"}>

      <div className="topic-title-section">
        <Container>
          <Grid container>
            <Grid item sm={12} md={6} lg={6}>
              <Typography variant="h1">Explore Mihidora</Typography>
              <Typography mb={2} variant="body1">Connecting You to Mihidora’s Rich Resources.</Typography>
            </Grid>
            <Grid item sm={12} md={6} lg={6}>
              <div className="section-links">
                <div style={{ marginRight: '20px' }}><ProjectLink name="Organisations" link={'/organizations'} icon={<LocationCityIcon fontSize="small" className="iconActive" />} /></div>
                <div style={{ marginRight: '20px' }}><ProjectLink name="Projects" link={'/projects'} icon={<NaturePeopleIcon fontSize="small" className="iconActive" />} /></div>
                <div style={{ marginRight: '20px' }}><ProjectLink name="Data" link={'/datahub'} icon={<TextSnippetIcon fontSize="small" className="iconActive" />} /></div>
                <div style={{ marginRight: '20px' }}><ProjectLink name="Resources" link={'/resource-exchange/jobs'} icon={<ArchitectureIcon fontSize="small" className="iconActive" />} /></div>
                <div style={{ marginRight: '20px' }}><ProjectLink name="E-Learning" link={'/elearning-materials'} icon={<AutoStoriesIcon fontSize="small" className="iconActive" />} /></div>
                <div style={{ marginRight: '20px' }}><ProjectLink name="What's On" link={'/whatson/events'} icon={<CalendarMonthIcon fontSize="small" className="iconActive" />} /></div>
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
            <Typography>Quickly sort through different key words and find information on Mihidora</Typography>
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

          {/* <Grid item sx={{ ml: 2 }} style={{ display: "flex", alignItems: "center" }}>
            <Button className="update-button" onClick={filterResults}>Filter</Button>
          </Grid> */}
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

          <Grid item sx={{ ml: { xs: 0, sm: 2 } }}>
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

          <Grid item sx={{ ml: { xs: 0, sm: 2 } }}>
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
              {/* <PlaceIcon sx={{ mr: 2, cursor: 'pointer', fontSize: 32 }} onClick={handleClickOpen} /> */}
              <PlaceIcon sx={{ mr: 2, cursor: 'pointer', fontSize: 32 }} onClick={handleDrawerOpen} />
              {/* <ListIcon sx={{ cursor: 'pointer', fontSize: 32 }} /> */}
            </div>
          </Grid>
        </Grid>

      </Container>

      {/* ------------------ projects --------------------- */}

      <div id="datasets" className="topic-sub-section">
        <Container>

          <Grid container>
            <Grid item xs={6}>
              <Typography variant="h4" className="section-title">Projects</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Link to='/projects' sx={{ color: '#93aa40' }}><Typography variant="button" sx={{ cursor: 'pointer' }}><b>View All</b></Typography></Link>
            </Grid>
          </Grid>
          {projectLoad ? <ListSkeleton /> :
            <Grid container spacing={2}>
              {projectList.map((project, key) => (
                <Grid item key={key} xs={3} className="organization_card" >
                  <Link to={`/project/` + project.slug}>
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
            projectList.length == 0 ?
              <Grid container>
                <Grid item sm={12} md={6}>
                  <Typography sx={{ fontSize: '12px' }} mt={3}>No projects found for selected filters</Typography>
                </Grid>
              </Grid>
              : ''
          }
        </Container>
      </div>

      {/* ------------------------- Data --------------------------------- */}

      <Container><Divider sx={{ mt: 2 }} /></Container>

      <div id="datasets" className="topic-sub-section">
        <Container>
          <Grid container>
            <Grid item xs={6}>
              <Typography variant="h4" className="section-title">Data</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Link to='/datahub' sx={{ color: '#93aa40' }}><Typography variant="button" sx={{ cursor: 'pointer' }}><b>View All</b></Typography></Link>
            </Grid>
          </Grid>
          {dataLoad ? <ListSkeleton /> :
            <Grid container spacing={2}>
              {dataList.map((data, key) => (
                <Grid item key={key} xs={3} className="organization_card" >
                  <Link to={`/datahub/${data.slug}`}>
                    {data.photos.length !== 0 ?
                      <CardMedia
                        component="img"
                        height="140"
                        image={`/storage/` + JSON.parse(data.photos)[0]}
                        onError={handleImageErrorData}
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
                      <Typography variant="h6" className="card-title">{data.title}</Typography>
                      <Typography variant="subtitle" className="card-body">
                        {data.overview !== null ? data.overview.substring(0, 50) : ''}
                      </Typography>
                      <ul className="related-tags">

                        {data.tags.length !== 0 ?
                          <li><Link to=''>
                            <Chip sx={{ marginTop: '5px', backgroundColor: '#edf7c9' }} label={data.tags[0].name.substring(0, 20)} />
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
            dataList.length == 0 ?
              <Grid container>
                <Grid item sm={12} md={6}>
                  <Typography sx={{ fontSize: '12px' }} mt={3}>No Data sets found for selected filters</Typography>
                </Grid>
              </Grid>
              : ''
          }
        </Container>
      </div>

      {/* ------------------------- E-Learning --------------------------------- */}

      <Container><Divider sx={{ mt: 2 }} /></Container>

      <div id="datasets" className="topic-sub-section">
        <Container>
          <Grid container>
            <Grid item xs={6}>
              <Typography variant="h4" className="section-title">E-Learning</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Link to='/elearning-materials' sx={{ color: '#93aa40' }}><Typography variant="button" sx={{ cursor: 'pointer' }}><b>View All</b></Typography></Link>
            </Grid>
          </Grid>
          {elearningLoading ? <ListSkeleton /> :
            <Grid container spacing={2}>
              {elearningList.map((data, key) => (
                <Grid item key={key} xs={3} className="organization_card" >
                  <Link to={`/elearning-material/${data.slug}`}>
                    {data.photos.length !== 0 ?
                      <CardMedia
                        component="img"
                        height="140"
                        image={`/storage/` + JSON.parse(data.photos)[0]}
                        onError={handleImageErrorData}
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
                      <Typography variant="h6" className="card-title">{data.title}</Typography>
                      <Typography variant="subtitle" className="card-body">
                        {data.overview !== null ? data.overview.substring(0, 50) : ''}
                      </Typography>
                      <ul className="related-tags">

                        {data.tags.length !== 0 ?
                          <li><Link to=''>
                            <Chip sx={{ marginTop: '5px', backgroundColor: '#edf7c9' }} label={data.tags[0].name.substring(0, 20)} />
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
            dataList.length == 0 ?
              <Grid container>
                <Grid item sm={12} md={6}>
                  <Typography sx={{ fontSize: '12px' }} mt={3}>No E-Learning material found for selected filters</Typography>
                </Grid>
              </Grid>
              : ''
          }
        </Container>
      </div>

      {/* ------------------------- Resources --------------------------------- */}

      <Container><Divider sx={{ mt: 2 }} /></Container>

      <div id="datasets" className="topic-sub-section">
        <Container>
          <Grid container>
            <Grid item xs={6}>
              <Typography variant="h4" className="section-title">Resource Exchange</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Link to='/resource-exchange/resource-sharing' sx={{ color: '#93aa40' }}><Typography variant="button" sx={{ cursor: 'pointer' }}><b>View All</b></Typography></Link>
            </Grid>
          </Grid>
          {resourceLoading ? <ListSkeleton /> :
            <Grid container spacing={2}>
              {resourceList.map((data, key) => (
                <Grid item key={key} xs={3} className="organization_card" >
                  <Link to={`/resource-exchange-resource-sharing/${data.slug}`}>
                    {data.photos.length !== 0 ?
                      <CardMedia
                        component="img"
                        height="140"
                        image={`/storage/` + JSON.parse(data.photos)[0]}
                        onError={handleImageErrorData}
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
                      <Typography variant="h6" className="card-title">{data.title}</Typography>
                      <Typography variant="subtitle" className="card-body">
                        {data.overview !== null ? data.overview.substring(0, 50) : ''}
                      </Typography>
                      <ul className="related-tags">

                        {data.tags.length !== 0 ?
                          <li><Link to=''>
                            <Chip sx={{ marginTop: '5px', backgroundColor: '#edf7c9' }} label={data.tags[0].name.substring(0, 20)} />
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
            resourceList.length == 0 ?
              <Grid container>
                <Grid item sm={12} md={6}>
                  <Typography sx={{ fontSize: '12px' }} mt={3}>No Resources found for selected filters</Typography>
                </Grid>
              </Grid>
              : ''
          }
        </Container>
      </div>

      {/* ------------------------- Jobs --------------------------------- */}

      <Container><Divider sx={{ mt: 2 }} /></Container>

      <div id="datasets" className="topic-sub-section">
        <Container>
          <Grid container>
            <Grid item xs={6}>
              <Typography variant="h4" className="section-title">Jobs</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Link to='/resource-exchange/jobs' sx={{ color: '#93aa40' }}><Typography variant="button" sx={{ cursor: 'pointer' }}><b>View All</b></Typography></Link>
            </Grid>
          </Grid>
          {resourceLoading ? <ListSkeleton /> :
            <Grid container spacing={2}>
              {jobList.map((data, key) => (
                <Grid item key={key} xs={3} className="organization_card" >
                  <Link to={`/resource-exchange-job/${data.slug}`}>
                    {data.photos.length !== 0 ?
                      <CardMedia
                        component="img"
                        height="140"
                        image={`/storage/` + JSON.parse(data.photos)[0]}
                        onError={handleImageErrorData}
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
                      <Typography variant="h6" className="card-title">{data.title}</Typography>
                      <Typography variant="subtitle" className="card-body">
                        {data.overview !== null ? data.overview.substring(0, 50) : ''}
                      </Typography>
                      <ul className="related-tags">

                        {data.tags.length !== 0 ?
                          <li><Link to=''>
                            <Chip sx={{ marginTop: '5px', backgroundColor: '#edf7c9' }} label={data.tags[0].name.substring(0, 20)} />
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
            resourceList.length == 0 ?
              <Grid container>
                <Grid item sm={12} md={6}>
                  <Typography sx={{ fontSize: '12px' }} mt={3}>No Resources found for selected filters</Typography>
                </Grid>
              </Grid>
              : ''
          }
        </Container>
      </div>

      {/* ------------------------- Grants --------------------------------- */}

      <Container><Divider sx={{ mt: 2 }} /></Container>

      <div id="datasets" className="topic-sub-section">
        <Container>
          <Grid container>
            <Grid item xs={6}>
              <Typography variant="h4" className="section-title">Grants</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Link to='/resource-exchange/grants-and-proposals' sx={{ color: '#93aa40' }}><Typography variant="button" sx={{ cursor: 'pointer' }}><b>View All</b></Typography></Link>
            </Grid>
          </Grid>
          {resourceLoading ? <ListSkeleton /> :
            <Grid container spacing={2}>
              {grantList.map((data, key) => (
                <Grid item key={key} xs={3} className="organization_card" >
                  <Link to={`/resource-exchange-proposal/${data.slug}`}>
                    {data.photos.length !== 0 ?
                      <CardMedia
                        component="img"
                        height="140"
                        image={`/storage/` + JSON.parse(data.photos)[0]}
                        onError={handleImageErrorData}
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
                      <Typography variant="h6" className="card-title">{data.title}</Typography>
                      <Typography variant="subtitle" className="card-body">
                        {data.overview !== null ? data.overview.substring(0, 50) : ''}
                      </Typography>
                      <ul className="related-tags">

                        {data.tags.length !== 0 ?
                          <li><Link to=''>
                            <Chip sx={{ marginTop: '5px', backgroundColor: '#edf7c9' }} label={data.tags[0].name.substring(0, 20)} />
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
            resourceList.length == 0 ?
              <Grid container>
                <Grid item sm={12} md={6}>
                  <Typography sx={{ fontSize: '12px' }} mt={3}>No Resources found for selected filters</Typography>
                </Grid>
              </Grid>
              : ''
          }
        </Container>
      </div>

      {/* ------------------------- Suppliers --------------------------------- */}

      <Container><Divider sx={{ mt: 2 }} /></Container>

      <div id="datasets" className="topic-sub-section">
        <Container>
          <Grid container>
            <Grid item xs={6}>
              <Typography variant="h4" className="section-title">Suppliers</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Link to='/resource-exchange/suppliers' sx={{ color: '#93aa40' }}><Typography variant="button" sx={{ cursor: 'pointer' }}><b>View All</b></Typography></Link>
            </Grid>
          </Grid>
          {resourceLoading ? <ListSkeleton /> :
            <Grid container spacing={2}>
              {supplierList.map((data, key) => (
                <Grid item key={key} xs={3} className="organization_card" >
                  <Link to={`/resource-exchange-supplier/${data.slug}`}>
                    {data.photos.length !== 0 ?
                      <CardMedia
                        component="img"
                        height="140"
                        image={`/storage/` + JSON.parse(data.photos)[0]}
                        onError={handleImageErrorData}
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
                      <Typography variant="h6" className="card-title">{data.title}</Typography>
                      <Typography variant="subtitle" className="card-body">
                        {data.overview !== null ? data.overview.substring(0, 50) : ''}
                      </Typography>
                      <ul className="related-tags">

                        {data.tags.length !== 0 ?
                          <li><Link to=''>
                            <Chip sx={{ marginTop: '5px', backgroundColor: '#edf7c9' }} label={data.tags[0].name.substring(0, 20)} />
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
            resourceList.length == 0 ?
              <Grid container>
                <Grid item sm={12} md={6}>
                  <Typography sx={{ fontSize: '12px' }} mt={3}>No Resources found for selected filters</Typography>
                </Grid>
              </Grid>
              : ''
          }
        </Container>
      </div>

      {/* ------------------------- Events --------------------------------- */}

      <Container><Divider sx={{ mt: 2 }} /></Container>

      <div id="datasets" className="topic-sub-section">
        <Container>
          <Grid container>
            <Grid item xs={6}>
              <Typography variant="h4" className="section-title">What’s On</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Link to='/whatson/events' sx={{ color: '#93aa40' }}><Typography variant="button" sx={{ cursor: 'pointer' }}><b>View All</b></Typography></Link>
            </Grid>
          </Grid>
          {eventsLoading ? <ListSkeleton /> :
            <Grid container spacing={2}>
              {eventList.map((data, key) => (
                <Grid item key={key} xs={3} className="organization_card" >
                  <Link to={`/whatson-event/${data.slug}`}>
                    {data.photos.length !== 0 ?
                      <CardMedia
                        component="img"
                        height="140"
                        image={`/storage/` + JSON.parse(data.photos)[0]}
                        onError={handleImageErrorData}
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
                      <Typography variant="h6" className="card-title">{data.title}</Typography>
                      <Typography variant="subtitle" className="card-body">
                        {data.overview !== null ? data.overview.substring(0, 50) : ''}
                      </Typography>
                      <ul className="related-tags">

                        {data.tags.length !== 0 ?
                          <li><Link to=''>
                            <Chip sx={{ marginTop: '5px', backgroundColor: '#edf7c9' }} label={data.tags[0].name.substring(0, 20)} />
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
            eventList.length == 0 ?
              <Grid container>
                <Grid item sm={12} md={6}>
                  <Typography sx={{ fontSize: '12px' }} mt={3}>No Events found for selected filters</Typography>
                </Grid>
              </Grid>
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
          <FMap topic={'all'} />
        </DialogContent>
      </Dialog>

    </BaseLayout>
  )
}

export default
  GoogleApiWrapper({
    apiKey: process.env.GOOGLE_MAP_API_KEY,
  })(TopicsList)
