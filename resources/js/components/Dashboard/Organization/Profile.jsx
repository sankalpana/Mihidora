import React, { useState, useEffect } from "react";
import {
  Grid, Box, TextField, Typography, Button, FormGroup, FormControl, InputLabel, Select, MenuItem,
  FormControlLabel, FormLabel, RadioGroup, Radio, Alert, Autocomplete, Chip, Stack, Divider,
} from "@mui/material";
import MainLayout from "../BaseLayout";
import MenuTab from "./MenuTab";
import ThematicTags from '../components/ThematicTags'
import SubjectTags from "../components/SubjectTags";
import ImageUploader from '../components/ImageUploader'
import ExtraTags from "../components/ExtraTags";
import ExampleTheme from "../LexicalEditor/themes/ExampleTheme";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import EditorEdit from "../LexicalEditor/EditorEdit";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function Profile(props) {
  const [alert, setAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertContent, setAlertContent] = useState('');
  const [orgTypeList, setOrgTypeList] = useState([]);
  const [orgId, setOrgId] = useState("");
  const [orgType, setOrgType] = useState("");
  const [orgSize, setOrgSize] = useState("");
  const [orgInput, setOrgInput] = useState({
    org_name: '',
    reg_number: '',
    description: '',
  });
  const [error, setError] = useState([]);
  const [tags_thematic, setTags_thematic] = useState([]);
  const [tags_subject, setTags_subject] = useState([]);
  const [tags_extra, setTags_extra] = useState([]);
  const [photos, setLogo] = useState([]);
  const [banners, setBanners] = useState([]);

  //======== tagging system
  const [postTags, setPostTags] = useState([]);
  const [l1tags, setL1tags] = useState([]);
  const [l2tags, setL2tags] = useState([]);
  const [l3tags, setL3tags] = useState([]);
  const [l4tags, setL4tags] = useState([]);
  const [thematics, setThematic] = useState({
    level1: '',
    level2: '',
    level3: '',
    level4: '',
  });
  const [subjectTags, setSubjectTags] = useState([]);
  const [extraTags, setExtraTags] = useState([]);
  const [otherTags, setOtherTags] = useState({
    subject: [],
    extra: []
  });
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

  const processTags = (data) => {
    setPostTags(data);

    data.forEach(tag => {
      setThematic(prevThematics => {
        if (tag.level === 1) {
          console.log(`Setting the level 1 tag`);
          return { ...prevThematics, level1: tag.id };
        }
        if (tag.level === 2) {
          console.log(`Setting the level 2 tag`);
          return { ...prevThematics, level2: tag.id };
        }
        if (tag.level === 3) {
          console.log(`Setting the level 3 tag`);
          return { ...prevThematics, level3: tag.id };
        }
        if (tag.level === 4) {
          console.log(`Setting the level 4 tag`);
          return { ...prevThematics, level4: tag.id };
        }
        return prevThematics;
      });
    });
    data.forEach(tag => {
      setOtherTags(prevOther => {
        if (tag.level === 10) {
          return {
            ...prevOther,
            subject: [...prevOther.subject, tag]
          }
        }
        if (tag.level === 11) {
          return {
            ...prevOther,
            extra: [...prevOther.extra, tag]
          }
        }
        return prevOther;
      });
    })
  }

  const handleTagDelete = (tag, id) => {
    // trverse through the postTags 
    const filteredPostTags = postTags.filter(postTag => {
      if (tag.level === 1) {
        setThematic({
          level1: '',
          level2: '',
          level3: '',
          level4: '',
        })
        return !(postTag.level >= 1 && postTag.level <= 4);
      } else if (tag.level === 2) {
        setThematic({
          ...thematics,
          level2: '',
          level3: '',
          level4: '',
        })
        return !(postTag.level >= 2 && postTag.level <= 4);
      } else if (tag.level === 3) {
        setThematic({
          ...thematics,
          level3: '',
          level4: '',
        })
        return !(postTag.level >= 3 && postTag.level <= 4);
      } else if (tag.level === 4) {
        setThematic({
          ...thematics,
          level4: '',
        })
        return !(postTag.level === 4);
      } else if (tag.level === 10) {
        const newSubjects = otherTags.subject.filter(item => item.id !== tag.id);
        setOtherTags({ ...otherTags, subject: newSubjects });
        return !(postTag.level === 10);
      } else if (tag.level === 11) {
        const newExtras = otherTags.extra.filter(item => item.id !== tag.id);
        setOtherTags({ ...otherTags, extra: newExtras });
        return !(postTag.level === 11);
      } else {
        // If tag.level doesn't match any condition, keep the postTag
        return true;
      }
    });
    setPostTags(filteredPostTags)


  }

  //======== end tagging system

  const [editorInitialConfig, setEditorInitialConfig] = useState([]);
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
  };

  useEffect(() => {
    getProfileData();
    getOrganizationTypes();
    loadTags({ level: 1 });
    loadTags({ level: 10 }); // load subject tags;
    loadTags({ level: 11 }); // load extra tags;

    if (orgInput?.description) {
      editorConfig.editorState = orgInput?.description;
      setEditorInitialConfig(editorConfig);
    }

  }, [localStorage.getItem('auth_id')]);

  const onChange = (editorState) => {
    console.log(editorState);
    editorState.read(() => {
      console.log(editorState);
      setOrgInput({ ...orgInput, description: JSON.stringify(editorState) });
    });
  }

  const getProfileData = () => {
    const org_id = localStorage.getItem('org_id');
    axios.get(`/api/edit-organisation/${org_id}`).then(res => {
      if (res.data.status === 200) {
        console.log(res.data)
        setOrgId(res.data.get_data.id);
        setOrgInput(res.data.get_data);
        setOrgType(res.data.get_data.org_type);
        setLogo(JSON.parse(res.data.get_data.org_logo));
        setBanners(JSON.parse(res.data.get_data.photos));
        setOrgSize(res.data.get_data.org_size);
        setTags_thematic(res.data.get_data.tags.filter(element => element.type == 1).map(element => element.name.en));
        setTags_subject(res.data.get_data.tags.filter(element => element.type == 2).map(element => element.name.en));
        setTags_extra(res.data.get_data.tags.filter(element => element.type == 3).map(element => element.name.en));

        processTags(res.data.get_data.tags);
      }
      else if (res.data.status === 404) {
        console.log(res.message, "message");
      }
    });
  }

  const getOrganizationTypes = () => {
    axios.get('/sanctum/csrf-cookie').then(response => {
      axios.get('/api/organisation-types').then(res => {
        if (res.data.status === 200) {
          setOrgTypeList(res.data.organizationTypes);
        }
      });
    });
  }

  const getMediaFiles = (e) => {
    setLogo(e);
  }

  const getBannerMediaFiles = (e) => {
    setBanners(e);
  }

  const handleInput = (e) => {
    e.persist();
    setOrgInput({ ...orgInput, [e.target.name]: e.target.value });
  }

  const tagsThematic = (value) => {
    setTags_thematic(value);
  }

  const tagsSubject = (value) => {
    setTags_subject(value);
  }

  const tagsExtra = (value) => {
    setTags_extra(value);
  }

  const selectOrgType = (event) => {
    setOrgType(event.target.value);
  }


  const selectOrgSize = (event) => {
    setOrgSize(event.target.value);
  }

  const handleLogoRemove = (e) => {
    setLogo([]);
  }

  const handleImageRemove = (e) => {
    console.log(e);
    setBanners(banners.filter(p => p !== e));
  }

  //Confirmation dialog
  const [confOpen, setConfOpen] = useState(false);
  const handleConfOpen = () => {
    setConfOpen(true);
  };
  const handleConfClose = () => {
    setConfOpen(false);
  };
  const handleConfConfirmation = (e) => {
    // delete the image
    console.log(e);
    setConfOpen(false);
  }


  const updateOrgProfile = (e) => {
    e.preventDefault();
    const data = {
      org_name: orgInput.org_name,
      org_type: orgType,
      org_size: orgSize,
      reg_number: orgInput.reg_number,
      description: orgInput.description,
      tags_thematic: tags_thematic,
      tags_subject: tags_subject,
      org_logo: photos,
      tags_extra: tags_extra,
      banner: banners,
      level1: thematics.level1,
      level2: thematics.level2,
      level3: thematics.level3,
      level4: thematics.level4,
      other_tags_subject: otherTags.subject.map((option) => option.id),
      other_tags_extra: otherTags.extra.map((option) => option.id)
    }
    // console.log(data);
    axios.put(`/api/update-organisation/${orgId}`, data).then(res => {
      if (res.data.status === 200) {
        setAlertType('success');
        setAlertContent(res.data.message);
        setAlert(true);
        setError([]);
      }
      else if (res.data.status === 422) {
        setError(res.data.errors);
      }
      else {
        console.log(res.data.errors, "error");
      }
    });
  }

  return (
    <MainLayout title={"Profile"}>
      <MenuTab />
      <Box component={"form"} onSubmit={updateOrgProfile}>
        <Grid container>
          <Grid item xs={8}>

            <FormLabel>Logo</FormLabel>
            <Divider sx={{
              marginBottom: '8px'
            }} />
            <Typography variant="caption" display="block" gutterBottom>
                Allowed file types are .jpg .jpeg .png
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
              <p>Step 1: Resize dimension of logo</p>
              Please maintain a square ratio for your logo. Aspect Ratios: 1024 x 1024 or 512 x 512.
              <br></br>
              Note: In order to create a square image you can use photoshop or ask a technical professional to resize it for you before uploading.
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
              <p>Step 2: Compress image</p>
              To compress the file size of the logo (less than 1MB), click on this <a target="_blank" rel="noopener noreferrer" href="https://tinypng.com/">TinyPNG</a>
              <br></br>
              Download the compressed file and upload it to Mihidora.
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
              **Please upload your organisation logo under "banner image" below. This will ensure your organisation logo appears on your profile thumbnail and page.  
            </Typography>
            <Box sx={{ mb: 2 }}>
              <ImageUploader setSelectedFiles={getMediaFiles} />
            </Box>
            <Grid container spacing={2} sx={{ 'marginBottom': 2 }}>
              {photos.map((element, index) => (
                <Grid key={index} item xs={4} className="photo-preview">
                  <Button onClick={() => handleLogoRemove(element)} className="remove-btn">
                    <img src={`../../../../images/remove-icon.png`} />
                  </Button>
                  <img src={`/storage/` + element} />
                </Grid>
              ))}
            </Grid>

            <FormLabel>Banner</FormLabel>
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
              <ImageUploader setSelectedFiles={getBannerMediaFiles} />
            </Box>
            <Grid container spacing={2} sx={{ 'marginBottom': 2 }}>
              {banners.map((element, index) => (
                <Grid key={index} item xs={4} className="photo-preview">
                  <img src={`/storage/` + element} />
                  <Button onClick={() => handleImageRemove(element)} className="remove-btn">
                    <img src={`../../../../images/remove-icon.png`} />
                  </Button>
                </Grid>
              ))}
            </Grid>


            <FormGroup className="form-group">
              <TextField
                type='text'
                fullWidth
                label="Organization Name"
                name="org_name"
                onChange={handleInput}
                value={orgInput.org_name}
              />
              <Typography variant="span">{error.org_name}</Typography>
            </FormGroup>
            <FormControl className="form-group">
              <InputLabel id="organisation-type-label">Organisation Type</InputLabel>
              <Select
                labelId="organisation-type-label"
                id="organisation-type"
                value={orgType}
                label="Organisation Type"
                onChange={selectOrgType}
              >
                {orgTypeList.map(row => <MenuItem key={row.id} value={row.id}>{row.type}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl className="sep-label-form">
              <FormLabel id="size-of-organization">Size of Organization - {orgSize}</FormLabel>
              <RadioGroup
                row
                onChange={selectOrgSize}
              >
                <FormControlLabel value="1 - 10" checked={orgSize == '1 - 10'} control={<Radio />} label="1 - 10" />
                <FormControlLabel value="11 - 30" checked={orgSize == '11 - 30'} control={<Radio />} label="11 - 30" />
                <FormControlLabel value="31 - 60" checked={orgSize == '31 - 60'} control={<Radio />} label="31 - 60" />
                <FormControlLabel value="61 - 100" checked={orgSize == '61 - 100'} control={<Radio />} label="61 - 100" />
                <FormControlLabel value="Over 100" checked={orgSize == 'Over 100'} control={<Radio />} label="Over 100" />
              </RadioGroup>
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl className="form-group">
                  <TextField
                    type='text'
                    fullWidth
                    label="Registration No"
                    name="reg_number"
                    onChange={handleInput}
                    value={orgInput.reg_number}
                  />
                  <Typography variant="span">{error.reg_number}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <FormGroup className="form-group">
              <TextField
                type='text'
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                onChange={handleInput}
                value={orgInput.description}
              />
              <Typography variant="span">{error.description}</Typography>

              {/* {editorInitialConfig.length !== 0 && <EditorEdit
                initialConfig={editorInitialConfig}
                onChange={onChange}
              />} */}

            </FormGroup>

            {/* <ThematicTags getThematicTags={tagsThematic} setThematicTag={tags_thematic} /> */}

            {/* <SubjectTags getSubjectTags={tagsSubject} setSubjectTag={tags_subject} /> */}

            {/* <ExtraTags getExtraTags={tagsExtra} setExtraTag={tags_extra} />  */}

            <Typography variant="subtitle1" gutterBottom>
              Thematic Tags
            </Typography>
            <Divider sx={{
              marginBottom: '20px'
            }} />

            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              {postTags.map((tag, id) => {
                return (
                  <Chip key={tag.id} sx={{ marginTop: '5px', backgroundColor: '#edf7c9' }} label={tag.name} onDelete={() => handleTagDelete(tag, id)} />
                )
              })}
            </Stack>
            {postTags.length > 0 ? (
              <Typography sx={{ fontSize: '12px', mb: 2 }}>Given above are the current tags for this project. You can update the tags from the options given below.</Typography>
            ) : ('')}

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
              className="user__theme-btn"
              sx={{ marginBottom: 2 }}
            >
              Update Profile
            </Button>

            {alert ? <Alert severity={alertType}>{alertContent}</Alert> : <></>}

          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  )
}

export default Profile