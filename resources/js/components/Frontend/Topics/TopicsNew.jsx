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
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import SettingsApplicationsOutlinedIcon from '@mui/icons-material/SettingsApplicationsOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import BaseLayout from "../BaseLayout";
import TopicMenu from "./TopicMenu";
import SearchIcon from '@mui/icons-material/Search';
import PlaceIcon from '@mui/icons-material/Place';
import ListIcon from '@mui/icons-material/List';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import ListSkeleton from '../components/ListSkeleton';
import Chip from '@mui/material/Chip';

function TopicsList() {
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

  useEffect(() => {
    loadProjects({ skip: 0, take: 4 });
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
    filterProjects({ filters: data, take: 4 });
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
    filterProjects({ filters: data, take: 4 });
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
    filterProjects({ filters: data, take: 4 });
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
    filterProjects({ filters: data, take: 4 });
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
    filterProjects({ filters: data, take: 4 });
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
    filterProjects({ filters: data, take: 4 });
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


  return (
    <BaseLayout title={"Topic"}>

      <div className="topic-title-section">
        <Container>
          <Grid container>
            <Grid item sm={12} md={6} lg={6}>
              <Typography variant="h1">Topics</Typography>
            </Grid>
            <Grid item sm={12} md={6} lg={6}>
              {/* Add section icons here */}
              {/* <Typography variant="h1">Topics</Typography> */}
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
        <Grid container spacing={3}>

          <Grid item>
            <FormControl sx={{ minWidth: 200, mt: 0 }} size="small" variant="standard">
              <InputLabel id="demo-simple-select-label">Location</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                name="location"
                value={state.location}
                label="Location"
                onChange={handleChange}
                sx={{
                  '& .MuiBackdrop-root': {
                    '&.Mui-focused': {
                      color: '#93aa40'
                    }
                  }
                }}
              >
                <MenuItem value={'tag 1'}>Tag 1</MenuItem>
                <MenuItem value={'tag 2'}>Tag 2</MenuItem>
                <MenuItem value={'tag 3'}>Tag 3</MenuItem>
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
              <PlaceIcon sx={{ mr: 2, cursor: 'pointer', fontSize: 32 }} />
              <ListIcon sx={{ cursor: 'pointer', fontSize: 32 }} />
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
              <Typography variant="button" sx={{ cursor: 'pointer' }}><b>View All</b></Typography>
            </Grid>
          </Grid>
          {projectLoad ? <ListSkeleton /> :
            <Grid container spacing={2}>
              {projectList.map((project, key) => (
                <Grid item key={key} xs={3} className="organization_card" >
                  <Link to={``}>
                    {project.photos.length !== 0 ? 
                      <CardMedia
                      component="img"
                      height="140"
                      image={`/storage/`+JSON.parse(project.photos)[0]}
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
              <Typography variant="button" sx={{ cursor: 'pointer' }}><b>View All</b></Typography>
            </Grid>
          </Grid>
          {dataLoad ? <ListSkeleton /> :
            <Grid container spacing={2}>
              {dataList.map((data, key) => (
                <Grid item key={key} xs={3} className="organization_card" >
                  <Link to={``}>
                    {data.photos.length !== 0 ? 
                      <CardMedia
                      component="img"
                      height="140"
                      image={`/storage/`+JSON.parse(data.photos)[0]}
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
                      <Typography variant="h6" className="card-title">{data.project_title} {data.tags.length}</Typography>
                      <Typography variant="subtitle" className="card-body">
                        {data.overview !== null ? data.overview.substring(0, 50) : ''}
                      </Typography>
                      <ul className="related-tags">

                        {/* {data.tags.length !== 0 ?
                          <li><Link to=''>
                            <Chip sx={{ marginTop: '5px', backgroundColor: '#edf7c9' }} label={data.tags[0].name.substring(0, 20)} />
                          </Link></li>
                          : ''} */}
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
              <Typography variant="button" sx={{ cursor: 'pointer' }}><b>View All</b></Typography>
            </Grid>
          </Grid>
          {loading ? <ListSkeleton /> :
            <Grid container spacing={2}>
              {projectList.map((row, key) => (
                <Grid item key={key} xs={3} className="organization_card" >
                  <Link to={``}>
                    <CardMedia
                      component="img"
                      height="140"
                      image="../../../images/project.jpg"
                      alt="green iguana"
                    />
                    <CardContent className="card_content">
                      <Typography variant="span" className="main-tag">THEMATIC AREA</Typography>
                      <Typography variant="h5" className="org_title">Conservation, UN-SDG 1</Typography>
                      <ul className="card_tags">
                        <li><a href=""><ArticleOutlinedIcon style={menuIcon} /> CSV</a></li>
                        <li><a href=""><SettingsApplicationsOutlinedIcon style={menuIcon} /> API</a></li>
                        <li><a href=""><LocationOnOutlinedIcon style={menuIcon} /> Map</a></li>
                      </ul>
                      <ul className="related-tags">
                        <li><Link to=''>#Airquality</Link></li>
                        <li><Link to=''>#Flora</Link></li>
                      </ul>
                    </CardContent>
                  </Link>
                </Grid>
              ))}
            </Grid>
          }
        </Container>
      </div>

      {/* ------------------------- Resources --------------------------------- */}

      <Container><Divider sx={{ mt: 2 }} /></Container>

      <div id="datasets" className="topic-sub-section">
        <Container>
          <Grid container>
            <Grid item xs={6}>
              <Typography variant="h4" className="section-title">Resources</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Typography variant="button" sx={{ cursor: 'pointer' }}><b>View All</b></Typography>
            </Grid>
          </Grid>
          {loading ? <ListSkeleton /> :
            <Grid container spacing={2}>
              {projectList.map((row, key) => (
                <Grid item key={key} xs={3} className="organization_card" >
                  <Link to={``}>
                    <CardMedia
                      component="img"
                      height="140"
                      image="../../../images/project.jpg"
                      alt="green iguana"
                    />
                    <CardContent className="card_content">
                      <Typography variant="span" className="main-tag">THEMATIC AREA</Typography>
                      <Typography variant="h5" className="org_title">Conservation, UN-SDG 1</Typography>
                      <ul className="card_tags">
                        <li><a href=""><ArticleOutlinedIcon style={menuIcon} /> CSV</a></li>
                        <li><a href=""><SettingsApplicationsOutlinedIcon style={menuIcon} /> API</a></li>
                        <li><a href=""><LocationOnOutlinedIcon style={menuIcon} /> Map</a></li>
                      </ul>
                      <ul className="related-tags">
                        <li><Link to=''>#Airquality</Link></li>
                        <li><Link to=''>#Flora</Link></li>
                      </ul>
                    </CardContent>
                  </Link>
                </Grid>
              ))}
            </Grid>
          }
        </Container>
      </div>

      {/* ------------------------- Resources --------------------------------- */}

      <Container><Divider sx={{ mt: 2 }} /></Container>

      <div id="datasets" className="topic-sub-section">
        <Container>
          <Grid container>
            <Grid item xs={6}>
              <Typography variant="h4" className="section-title">Events</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Typography variant="button" sx={{ cursor: 'pointer' }}><b>View All</b></Typography>
            </Grid>
          </Grid>
          {loading ? <ListSkeleton /> :
            <Grid container spacing={2}>
              {projectList.map((row, key) => (
                <Grid item key={key} xs={3} className="organization_card" >
                  <Link to={``}>
                    <CardMedia
                      component="img"
                      height="140"
                      image="../../../images/project.jpg"
                      alt="green iguana"
                    />
                    <CardContent className="card_content">
                      <Typography variant="span" className="main-tag">THEMATIC AREA</Typography>
                      <Typography variant="h5" className="org_title">Conservation, UN-SDG 1</Typography>
                      <ul className="card_tags">
                        <li><a href=""><ArticleOutlinedIcon style={menuIcon} /> CSV</a></li>
                        <li><a href=""><SettingsApplicationsOutlinedIcon style={menuIcon} /> API</a></li>
                        <li><a href=""><LocationOnOutlinedIcon style={menuIcon} /> Map</a></li>
                      </ul>
                      <ul className="related-tags">
                        <li><Link to=''>#Airquality</Link></li>
                        <li><Link to=''>#Flora</Link></li>
                      </ul>
                    </CardContent>
                  </Link>
                </Grid>
              ))}
            </Grid>
          }
        </Container>
      </div>

    </BaseLayout>
  )
}

export default TopicsList
