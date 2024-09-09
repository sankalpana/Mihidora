import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  TextField,
  Typography,
  Button,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  FormLabel,
  Snackbar
} from "@mui/material";

import MainLayout from "../BaseLayout";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import MenuTab from './MenuTab';
import FileUploader from '../components/FileUploader';
import ImageUploader from '../components/ImageUploader';
import ThematicTags from '../components/ThematicTags'
import SubjectTags from "../components/SubjectTags"
import ExtraTags from "../components/ExtraTags"
import moment from "moment"
import Editor from "../LexicalEditor/Editor";
import '../LexicalEditor/styles.css'

import Autocomplete from '@mui/material/Autocomplete';
import LocationSearch from "../../Frontend/ResourceExchange/LocationSearch";
import Divider from '@mui/material/Divider';
import Map from '../Map'

function AddNewElearning(props) {
  const [alert, setAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertContent, setAlertContent] = useState('');
  const [whatYouWillLearn, setWhatYouWillLearn] = useState([{ what_you_will_learn: "" }]);
  const [Content, setContent] = useState([{ content: "" }]);
  const [formInput, setOrgInput] = useState({
    title: '',
    description: '',
    author: '',
    date: '',
    phone: '',
    email: '',
    overview: '',
  });
  const [error, setError] = useState([]);
  const [startDate, setStartDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const [projectList, setProjectList] = useState([]);
  const [linkProject, setLinkProject] = useState("");
  const [photos, setPhotos] = useState([]);
  const [files, setFiles] = useState([]);
  const [tags_thematic, setTags_thematic] = useState([]);
  const [tags_subject, setTags_subject] = useState([]);
  const [tags_extra, setTags_extra] = useState([]);

  //new thematics & location
  const [l1tags, setL1tags] = useState([]);
  const [l2tags, setL2tags] = useState([]);
  const [l3tags, setL3tags] = useState([]);
  const [l4tags, setL4tags] = useState([]);
  const [subjectTags, setSubjectTags] = useState([]);
  const [extraTags, setExtraTags] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [linkDistrict, setLinkDistrict] = useState("");
  const [center, setCenter] = useState({ lat: 7.873054, lng: 80.771797 });
  const [otherTags, setOtherTags] = useState({
    subject: [],
    extra: []
  });
  const [thematics, setThematic] = useState({
    level1: '',
    level2: '',
    level3: '',
    level4: '',
  });
  const [markerLocations, setMarkerLocations] = useState([]);
  const handlePlacesChanged = (places) => {
    console.log(places[0].geometry.location.lat());
    console.log(places[0].geometry.location.lng());
    let lat = places[0].geometry.location.lat();
    let lng = places[0].geometry.location.lng();
    setCenter({ lat: lat, lng: lng });
    // setLocation([...locations, [lat, lng]]);
    setMarkerLocations([...markerLocations, { lat: lat, lng: lng }]);
    setLocation([...locations, { lat: lat, lng: lng }]);
    setSelectedPlaces(places);

  };
  const getDistrictList = () => {
    axios.get(`/api/districts`).then(res => {
      if (res.data.status === 200) {
        setDistrictList(res.data.districts);
        setLinkDistrict(`26`);

      }
      else if (res.data.status === 404) {
        console.log(res.message, "message");
      }
    });
  }
  //end new thematics & location

  useEffect(() => {
    getProjectList();
    getDistrictList();
    loadTags({ level: 1 }); // load level 1 tags; atleast l1 is mandatory
    loadTags({ level: 10 }); // load subject tags;
    loadTags({ level: 11 }); // load extra tags;

  }, [localStorage.getItem('auth_id')]);

  const getProjectList = () => {
    axios.get('/api/projects-for-dashboard-dropdowns').then(res => {
      // axios.get('/api/projects-by-organization').then(res => {
      if (res.data.status === 200) {
        setProjectList(res.data.projects);
        setLinkProject(`1`);
      }
      else if (res.data.status === 404) {
        console.log(res.message, "message");
      }
    });
  }


  const selectLinkProject = (event) => {
    setLinkProject(event.target.value);
  }

  const handleInput = (e) => {
    e.persist();
    setOrgInput({ ...formInput, [e.target.name]: e.target.value });
  }

  const handleStartDate = (value) => {
    var start_date = moment(value.$d).format("YYYY-MM-DD");
    //console.log(start_date);
    setStartDate(start_date);
  };

  //uploaders
  const getMediaFiles = (e) => {
    setFiles(e);
  }

  const getImages = (e) => {
    setPhotos(e);
  }

  const handleDocRemove = (e) => {
    setFiles(files.filter(p => p !== e));
  }

  const handleImageRemove = (e) => {
    setPhotos(photos.filter(p => p !== e));
  }
  //end uploaders

  const tagsThematic = (value) => {
    setTags_thematic(value);
  }

  const tagsSubject = (value) => {
    setTags_subject(value);
  }

  const tagsExtra = (value) => {
    setTags_extra(value);
  }

  const handleL1Change = (e) => {
    setThematic({
      level1: e.target.value,
      level2: '',
      level3: '',
      level4: '',
    });
    loadTags({ level: 2, parent: e.target.value });
  }
  const handleL2Change = (e) => {
    setThematic({
      ...thematics,
      level2: e.target.value,
      level3: '',
      level4: '',
    });
    loadTags({ level: 3, parent: e.target.value });
  }
  const handleL3Change = (e) => {
    setThematic({
      ...thematics,
      level3: e.target.value,
      level4: '',
    });
    loadTags({ level: 4, parent: e.target.value });
  }
  const handleL4Change = (e) => {
    setThematic({
      ...thematics,
      level4: e.target.value,
    });
  }

  const handleSujectTagChange = (event, newValue) => {
    setOtherTags({ ...otherTags, subject: newValue });
  }
  const handleExtrasChange = (event, newValue) => {
    setOtherTags({ ...otherTags, extra: newValue });
  }

  // load tags
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

  const selectLinkDistrict = (event) => {
    setLinkDistrict(event.target.value);
  }

  //Location related
  const [locations, setLocation] = useState([]);
  const lanlat = (value) => {
    setLocation(value);
  }

  //whatyouwilllearn

  const addWhatYouWillLearnFields = () => {
    let newfield = { what_you_will_learn: '' }
    setWhatYouWillLearn([...whatYouWillLearn, newfield])
  }
  const removeWhatYouWillLearnFields = (index) => {
    let data = [...whatYouWillLearn];
    data.splice(index, 1)
    setWhatYouWillLearn(data)
  }
  const handleWhatYouWillLearnChange = (index, event) => {
    let data = [...whatYouWillLearn];
    data[index][event.target.name] = event.target.value;
    setWhatYouWillLearn(data);
  }

  //--

  //content

  const addContentFields = () => {
    let newfield1 = { content: '' }
    setContent([...Content, newfield1])
  }
  const removeContentFields = (index1) => {
    let data1 = [...Content];
    data1.splice(index1, 1)
    setContent(data1)
  }
  const handleContentChange = (index1, event1) => {
    let data1 = [...Content];
    data1[index1][event1.target.name] = event1.target.value;
    setContent(data1);
  }

  //--

  const createElearningMaterial = (e) => {
    e.preventDefault();
    const user_id = localStorage.getItem('auth_id');
    const data = {
      user_id: user_id,
      organization_id: localStorage.getItem('org_id'),
      project_id: linkProject,
      title: formInput.title,
      type: 2,
      overview: formInput.overview,
      description: formInput.description,
      uploads: files, //files
      photos: photos,   //photos
      date: startDate,
      author: formInput.author,
      what_you_will_learn: whatYouWillLearn,
      contents: Content,
      phone: formInput.phone,
      email: formInput.email,
      tags_thematic: tags_thematic,
      tags_subject: tags_subject,
      tags_extra: tags_extra,
      level1: thematics.level1,
      level2: thematics.level2,
      level3: thematics.level3,
      level4: thematics.level4,
      other_tags_subject: otherTags.subject.map((option) => option.id),
      other_tags_extra: otherTags.extra.map((option) => option.id),
      district_id: linkDistrict,
      locations: locations,
    }
    axios.post(`/api/create-education`, data).then(res => {
      console.log(res.data);
      if (res.data.status === 200) {
        setAlert(true);
        setAlertType('success');
        setAlertContent(res.data.message);
        setError([]);
      }
      else if (res.data.status === 422) {
        setError(res.data.errors);
        setSnackAlert({
          type: 'error',
          'message': JSON.stringify(res.data.validation_errors),
          'error': JSON.stringify(res.data.validation_errors),
        });
        setAlertOpen(true);
      }
      else {
        console.log(res.data.errors);
        setSnackAlert({
          type: 'error',
          'message': JSON.stringify(res.data.validation_errors),
          'error': JSON.stringify(res.data.validation_errors),
        });
        setAlertOpen(true);
      }
    });
  }

  const onChange = (editorState) => {
    editorState.read(() => {
      setOrgInput({ ...formInput, description: JSON.stringify(editorState) });
    });
  }

  // Snackbar Alert
  const [alertOpen, setAlertOpen] = useState(false);
  const [snackAlert, setSnackAlert] = useState({
    type: 'success',
    message: '',
    error: 'An error occurred!'
  });
  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  return (
    <MainLayout title={"Add E-learning Material"}>
      <MenuTab />
      <Box component={"form"} onSubmit={createElearningMaterial} method="POST" encType="multipart/form-data" onKeyDown={handleKeyDown}>
        <Grid container>
          <Grid item xs={12}>

            <FormGroup className="form-group">
              <TextField
                type='text'
                fullWidth
                label="Title"
                name="title"
                onChange={handleInput}
                value={formInput.title}
              />
              <Typography variant="span">{error.title}</Typography>
            </FormGroup>

            <FormGroup className="form-group">
              <TextField
                multiline
                rows={4}
                type='text'
                fullWidth
                label="Overview *"
                name="overview"
                inputProps={{
                  maxLength: 198,
                }}
                onChange={handleInput}
                value={formInput.overview || ''}
              />
              <Typography variant="span">{error.overview}</Typography>
              <Typography variant="caption" display="block" mt={1}>
                * Please limit the overview to 200 characters.
              </Typography>
            </FormGroup>

            <FormControl className="form-group">
              <InputLabel id="project-label">Project</InputLabel>
              <Select
                labelId="project-label"
                id="project"
                value={linkProject}
                label="Project"
                onChange={selectLinkProject}
              >
                {projectList.map(row => <MenuItem key={row.id} value={row.id}>{row.project_title}</MenuItem>)}
              </Select>
            </FormControl>

            <Editor onChange={onChange} />

            <FormControl className="sep-label-form for-dynamic-fields">
              <FormLabel id="what_you_learn">What you will learn</FormLabel>
              {whatYouWillLearn.map((input, index) => {
                return (
                  <div key={index} className="form-group dynamic-field">
                    <TextField
                      fullWidth
                      type='text'
                      size="small"
                      name='what_you_will_learn'
                      value={input.what_you_will_learn || ''}
                      onChange={event => handleWhatYouWillLearnChange(index, event)}
                    />
                    {
                      index ?
                        <button type="button" className="button remove" onClick={() => removeWhatYouWillLearnFields(index)}><DeleteIcon /></button>
                        : null
                    }
                  </div>
                )
              })}
              <Button onClick={() => addWhatYouWillLearnFields()}>Add New Field</Button>
            </FormControl>

            <FormControl className="sep-label-form for-dynamic-fields">
              <FormLabel id="content">Content</FormLabel>
              {Content.map((input, index) => {
                return (
                  <div key={index} className="form-group dynamic-field">
                    <TextField
                      fullWidth
                      type='text'
                      size="small"
                      name='content'
                      value={input.content || ''}
                      onChange={event => handleContentChange(index, event)}
                    />
                    {
                      index ?
                        <button type="button" className="button remove" onClick={() => removeContentFields(index)}><DeleteIcon /></button>
                        : null
                    }
                  </div>
                )
              })}
              <Button onClick={() => addContentFields()}>Add New Field</Button>
            </FormControl>

            <FormLabel>File</FormLabel>
            <Divider sx={{
              marginBottom: '8px'
            }} />
            <Typography variant="caption" display="block">
              * Allowed file types are .csv .excel .pdf .zip .pdf
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
              * Maximum allowed file size is 5Mb
            </Typography>
            <Box sx={{ mb: 2 }}>
              <FileUploader setSelectedFiles={getMediaFiles} files={files} />
            </Box>
            <Grid container spacing={2} sx={{ 'marginBottom': 6 }}>
              {files.map((item, index) => {
                var fileName = item.split('/');
                return <Grid key={index} item xs={2} className="doc-preview">
                  <Button onClick={() => handleDocRemove(item)} className="remove-btn">
                    <img src={`../../../../images/remove-icon.png`} />
                  </Button>
                  <Typography style={{ width: 'calc(100% - 20px)', wordBreak: 'break-all', fontSize: 13, lineHeight: 1.2, textAlign: 'center', top: '96%', position: 'absolute' }}>{fileName[1]}</Typography>
                  <img src={`../../../../images/unknown-icon.png`} />
                </Grid>
              })}
            </Grid>

            <FormLabel>Photos</FormLabel>
            <Divider sx={{
              marginBottom: '8px'
            }} />
            <Typography variant="caption" display="block" gutterBottom>
              Allowed file types are .jpg .jpeg .png
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
              <p>Step 1: Resize dimension of Banner</p>
              Please maintain a rectangular (landscape) ratio for your banner. Aspect Ratios: 1920 x 1080 or 960 x 540.
              <br></br>
              Note: In order to create a rectangular (landscape) image you can use photoshop or ask a technical professional to resize it for you before uploading.
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
              <p>Step 2: Compress image</p>
              To compress the file size of the logo (less than 1MB), click on this <a target="_blank" rel="noopener noreferrer" href="https://tinypng.com/">TinyPNG</a>
              <br></br>
              Download the compressed file and upload it to Mihidora.
            </Typography>
            <Box sx={{ mb: 2 }}>
              <ImageUploader setSelectedFiles={getImages} />
            </Box>
            <Grid container spacing={2} sx={{ 'marginBottom': 8 }}>
              {photos.map((element, index) => (
                <Grid key={index} item xs={4} className="photo-preview">
                  <Button onClick={() => handleImageRemove(element)} className="remove-btn">
                    <img src={`../../../../images/remove-icon.png`} />
                  </Button>
                  <img src={`/storage/` + element} />
                </Grid>
              ))}

            </Grid>



            <Grid container spacing={2}>
              <Grid item xs={6}>

                <FormGroup className="form-group">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      label="Date"
                      inputFormat="YYYY-MM-DD"
                      value={startDate}
                      onChange={handleStartDate}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  <Typography variant="span">{error.start_date}</Typography>
                </FormGroup>
              </Grid>
              <Grid item xs={6}></Grid>
            </Grid>
            <FormGroup className="form-group">
              <TextField
                type='text'
                fullWidth
                label="Author"
                name="author"
                onChange={handleInput}
                value={formInput.author}
              />
              <Typography variant="span">{error.author}</Typography>
            </FormGroup>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormGroup className="form-group">
                  <TextField
                    type='text'
                    fullWidth
                    label="Phone"
                    name="phone"
                    onChange={handleInput}
                    value={formInput.phone}
                  />
                  <Typography variant="span">{error.phone}</Typography>
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormGroup className="form-group">
                  <TextField
                    type='text'
                    fullWidth
                    label="Email"
                    name="email"
                    onChange={handleInput}
                    value={formInput.email}
                  />
                  <Typography variant="span">{error.email}</Typography>
                </FormGroup>
              </Grid>
            </Grid>


            <FormControl className="form-group">
              <InputLabel id="district-label">District *</InputLabel>
              <Select
                labelId="district-label"
                id="district"
                value={linkDistrict}
                label="District"
                onChange={selectLinkDistrict}
              >
                {districtList.map(row => <MenuItem key={row.id}
                  value={row.id}>{row.name_en}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl className="form-group">
              {/* Location Search Box */}
              {/* <InputLabel id="address-label">Location</InputLabel> */}
              <LocationSearch onPlacesChanged={handlePlacesChanged} />
            </FormControl>
            {/* <Map zoom={8} center={{ lat: 7.873054, lng: 80.771797 }} getLanLat={lanlat}  listLangLat={[]}/> */}
            <Map zoom={8} center={center} getLanLat={lanlat} listLangLat={markerLocations} />
            {/* <ThematicTags getThematicTags={tagsThematic} setThematicTag={tags_thematic} /> */}

            {/* <SubjectTags getSubjectTags={tagsSubject} setSubjectTag={tags_subject} />

            <ExtraTags getExtraTags={tagsExtra} setExtraTag={tags_extra} /> */}
            <Typography variant="subtitle1" gutterBottom>
              Thematic Tags
            </Typography>
            <Divider sx={{
              marginBottom: '20px'
            }} />
            {/* New Tag Group */}
            {/* Thematic level 1 */}
            <FormGroup className="form-group">
              <FormControl sx={{ minWidth: 200 }} size="small">
                <InputLabel id="level-1-tag-label">Level 1</InputLabel>
                <Select
                  value={thematics.level1}
                  onChange={handleL1Change}
                  key={0}
                  labelId="level-1-tag-label"
                  label="Level 1 Tags"
                >
                  <MenuItem value={''}>None</MenuItem>
                  {l1tags.map((tag) => {
                    return <MenuItem key={tag.slug} value={tag.id}>{tag.name}</MenuItem>
                  })}

                </Select>
              </FormControl>
            </FormGroup>
            {/* Thematic level 2 */}
            <FormGroup className="form-group">
              <FormControl sx={{ minWidth: 200 }} size="small">
                <InputLabel id="level-2-tag-label">Level 2</InputLabel>
                <Select
                  value={thematics.level2}
                  onChange={handleL2Change}
                  key={0}
                  labelId="level-2-tag-label"
                  label="Level 2 Tags"
                >
                  <MenuItem value={''}>None</MenuItem>
                  {l2tags.map((tag) => {
                    return <MenuItem key={tag.slug} value={tag.id}>{tag.name}</MenuItem>
                  })}
                </Select>
              </FormControl>
            </FormGroup>
            {/* Thematic level 3 */}
            <FormGroup className="form-group">
              <FormControl sx={{ minWidth: 200 }} size="small">
                <InputLabel id="level-3-tag-label">Level 3</InputLabel>
                <Select
                  value={thematics.level3}
                  onChange={handleL3Change}
                  key={0}
                  labelId="level-3-tag-label"
                  label="Level 3 Tags"
                >
                  <MenuItem value={''}>None</MenuItem>
                  {l3tags.map((tag) => {
                    return <MenuItem key={tag.slug} value={tag.id}>{tag.name}</MenuItem>
                  })}
                </Select>
              </FormControl>
            </FormGroup>

            {/* Thematic level 3 */}
            <FormGroup className="form-group">
              <FormControl sx={{ minWidth: 200 }} size="small">
                <InputLabel id="level-4-tag-label">Level 4</InputLabel>
                <Select
                  value={thematics.level4}
                  onChange={handleL4Change}
                  key={0}
                  labelId="level-4-tag-label"
                  label="Level 4 Tags"
                >
                  <MenuItem value={''}>None</MenuItem>
                  {l4tags.map((tag) => {
                    return <MenuItem key={tag.slug} value={tag.id}>{tag.name}</MenuItem>
                  })}
                </Select>
              </FormControl>
            </FormGroup>

            <Typography variant="subtitle1" gutterBottom>
              Other Tags
            </Typography>
            <Divider sx={{
              marginBottom: '20px'
            }} />
            {/* Subject Tags */}
            <FormGroup className="form-group">
              <FormControl sx={{ minWidth: 200 }} size="small">
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
                    <TextField {...params} label="Subject Tags" />
                  )}
                />
              </FormControl>
            </FormGroup>

            {/* Extra Tags */}
            <FormGroup className="form-group">
              <FormControl sx={{ minWidth: 200 }} size="small">
                <Autocomplete
                  multiple
                  limitTags={3}
                  id="subject-tags"
                  value={otherTags.extra}
                  onChange={handleExtrasChange}
                  options={extraTags}
                  getOptionLabel={(option) => option.name}
                  defaultValue={[]}
                  renderInput={(params) => (
                    <TextField {...params} label="Extra Tags" />
                  )}
                />
              </FormControl>
            </FormGroup>

            <Button
              fullWidth
              variant={"outlined"}
              type={"submit"}
              className="user__theme-btn">
              Add New Elearning
            </Button>

            {alert ? <Alert className="response-alert" severity={alertType}>{alertContent}</Alert> : <></>}

          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={alertOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        autoHideDuration={6000}
        onClose={handleAlertClose}>
        <Alert
          onClose={handleAlertClose}
          severity={snackAlert.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackAlert.error}
        </Alert>
      </Snackbar>
    </MainLayout>
  )
}

export default AddNewElearning
