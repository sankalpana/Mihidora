// Sidebar.js
import React, { useEffect, useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ClickAwayListener,
  Grid,
  Autocomplete,
  TextField,
  Typography,
} from '@mui/material';
import { filter } from 'lodash';

const Sidebar = ({ isOpen, handleClose, handleSelectChange, updateMarkers, topic }) => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [tagsLoading, setTagsLoading] = useState(false);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [subjectTags, setSubjectTags] = useState([]); // holds subject tag list for the filter
  const [extraTags, setExtraTags] = useState([]); // holds extra tag list for the filter
  const [l1tags, setL1tags] = useState([]);
  const [l2tags, setL2tags] = useState([]);
  const [l3tags, setL3tags] = useState([]);
  const [l4tags, setL4tags] = useState([]);
  const [state, setState] = useState({
    level1: '',
    level2: '',
    level3: '',
    level4: '',
    location: '',
    sortBy: '',
    district: '',
  })
  const [otherTags, setOtherTags] = useState({
    subject: [],
    extra: [],
  })
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    loadTags({ level: 1 }); // load level 1 tags
    loadTags({ level: 10 }); // load subject tags
    loadTags({ level: 11 }); // load extra tags
    loadDistricts();
    let data = [
      state.level1,
      state.level2,
      state.level3,
      state.level4,
      ...otherTags.subject.map((option) => option.id),
      ...otherTags.extra.map((option) => option.id),
    ]
    filterProjects({ filters: data, district: state.district });
    console.log(`Framed from ${topic}`);
  }, []);

  const loadTags = (data) => {
    setTagsLoading(true);
    axios.get('/sanctum/csrf-cookie').then(() => {
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
  const loadDistricts = () => {
    axios.get('/sanctum/csrf-cookie').then(response => {
      axios.get('/api/districts').then(res => {
        console.log(res)
        if (res.status == 200) {
          setDistricts(res.data.districts);
        } else {
          // handle the error
          // setProjectLoad(false);
        }
      });
    });
  }

  const filterProjects = (data) => {
    setRecordsLoading(true);
    axios.get('/sanctum/csrf-cookie').then(response => {
      axios.post('/api/filter-topics-map', data).then(res => {
        console.log(res)
        if (res.status == 200) {
          let markers = res.data.results.filter((project) => {
            if (project.locations != null) {
              let cords = JSON.parse(project.locations);
              if (cords.length > 0) {
                return {
                  cords: JSON.parse(project.locations),
                  text: project.title
                };
              }
            }
          });
          let filtered
          if (topic == 'all') {
            filtered = markers.map((marker) => {
              let cords = JSON.parse(marker.locations);
              if (cords[0].lat > 0) {
                return {
                  lat: cords[0].lat,
                  lng: cords[0].lng,
                  text: marker.title,
                  overview: marker.overview != null ? marker.overview.substring(0, 50) : marker.overview,
                  url: marker.slug,
                  label: marker.label
                }
              }
            })
          } else {
            filtered = markers
              .filter(marker => marker.type === topic)
              .map(marker => {
                let cords = JSON.parse(marker.locations);
                if (cords[0].lat > 0) {
                  return {
                    lat: cords[0].lat,
                    lng: cords[0].lng,
                    text: marker.title,
                    overview: marker.overview != null ? marker.overview.substring(0, 50) : marker.overview,
                    url: marker.slug,
                    label: marker.label
                  };
                }
              });
          }
          updateMarkers(filtered);
          console.log(filtered);
          setRecordsLoading(false);
        } else {
          setRecordsLoading(false);
          // handle the error
          // setProjectLoad(false);
        }
      });
    });
  }

  // handle input field changes;
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
  }


  const handleClickAway = () => {
    // Close the Select components when clicking away
    // You can add any additional logic here if needed
  };

  const handleGenerateMarkers = () => {
    // Generate a sample set of markers based on the selected values
    const generatedMarkers = generateMarkers(selectedLocation, selectedTag);
    // Call the updateMarkers function from the parent component
    let data = [
      state.level1,
      state.level2,
      state.level3,
      state.level4,
      ...otherTags.subject.map((option) => option.id),
      ...otherTags.extra.map((option) => option.id),
    ]
    filterProjects({ filters: data, district: state.district });
    // updateMarkers(generatedMarkers);
    console.log(state);
    console.log(otherTags);
  };

  const generateMarkers = () => {
    // Replace this with your logic to generate markers based on location and tag
    // For now, just return a sample set of markers
    return [
      { lat: 7.0, lng: 80.0, text: 'Generated Marker A', open: false },
      { lat: 7.1, lng: 80.1, text: 'Generated Marker B', open: false },
      { lat: 7.2, lng: 80.2, text: 'Generated Marker C', open: false },
    ];
  };

  return (
    <Drawer anchor="left" open={isOpen} onClose={handleClose} sx={{ zIndex: 1300 }}>
      <ClickAwayListener onClickAway={handleClickAway}>
        <List sx={{ width: '250px' }}>
          <ListItem key='tt11'>
            <Grid container>
              <Grid item sm={12} md={6}>
                <Typography sx={{ fontSize: '12px' }} mt={1}>Thematic Tags</Typography>
              </Grid>
            </Grid>
          </ListItem>
          <ListItem key='tt1'>
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
          <ListItem key='tt2'>
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
          <ListItem key='tt3'>
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
          <ListItem key='tt4'>
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
          <ListItem key='tt41'>
            <Grid container>
              <Grid item sm={12} md={6}>
                <Typography sx={{ fontSize: '12px' }} mt={1}>Other Tags</Typography>
              </Grid>
            </Grid>
          </ListItem>
          <ListItem key='tt42'>
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
          <ListItem key='tt5'>
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
          <ListItem key='tt72'>
            <Grid container>
              <Grid item sm={12} md={6}>
                <Typography sx={{ fontSize: '12px' }} mt={1}>Location</Typography>
              </Grid>
            </Grid>
          </ListItem>
          <ListItem key='tt7'>
            <Grid item sx={{ mt: 1 }}>
              <FormControl sx={{ minWidth: 200, mt: 0 }} size="small" variant="standard">
                <InputLabel id="demo-simple-select-label">District</InputLabel>
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
          <ListItem sx={{ justifyContent: 'center' }}>
            {/* Add a button to generate markers */}
            <a className="banner-buttons" onClick={handleGenerateMarkers}>Update Map</a>
            {/* <button onClick={handleGenerateMarkers}>Generate Markers</button> */}
          </ListItem>
        </List>
      </ClickAwayListener>
    </Drawer>
  );
};

export default Sidebar;
