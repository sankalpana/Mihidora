import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import {
    Grid,
    Box,
    TextField,
    FormControl,
    Select,
    Typography,
    Button,
    MenuItem,
    InputLabel,
    Alert,
    FormLabel,
    FormGroup,
    Divider,
    Stack,
    Autocomplete,
    Chip,
    Snackbar,
} from "@mui/material"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
//import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import MainLayout from "../BaseLayout"
import moment from "moment"
import MenuTab from "./MenuTab"
import Map from '../Map'
import ThematicTags from '../components/ThematicTags'
import SubjectTags from "../components/SubjectTags";
import ExtraTags from "../components/ExtraTags";
import FileUploader from '../components/FileUploader';
import ImageUploader from '../components/ImageUploader';
import ExampleTheme from "../LexicalEditor/themes/ExampleTheme";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import EditorEdit from "../LexicalEditor/EditorEdit";

function EditWhatson(props) {
    const datasetParams = useParams();
    const [alert, setAlert] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [alertContent, setAlertContent] = useState('');
    const [activityType, setActivityType] = useState(1);
    const [formInput, setFormInput] = useState({
        title: '',
        description: '',
        route: '',
        overview: '',
    });
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [locations, setLocation] = useState([]);
    const [error, setError] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const [linkProject, setLinkProject] = useState("");
    const [photos, setPhotos] = useState([]);
    const [files, setFiles] = useState([]);
    const [mediaArticle, setMediaArticle] = useState(true);
    const [tags_thematic, setTags_thematic] = useState([]);
    const [tags_subject, setTags_subject] = useState([]);
    const [tags_extra, setTags_extra] = useState([]);

    const [districtList, setDistrictList] = useState([]);
    const [linkDistrict, setLinkDistrict] = useState("");
    const [cityList, setCityList] = useState([]);
    const [linkCity, setLinkCity] = useState("");

    useEffect(() => {
        getWhatsonList();
        getProjectList();
        getDistrictList();
        getCityList();
        loadTags({ level: 1 });
        loadTags({ level: 10 }); // load subject tags;
        loadTags({ level: 11 }); // load extra tags;

    }, [datasetParams.slug, localStorage.getItem('auth_id')]);

    const getWhatsonList = () => {
        axios.get(`/api/edit-whatson/${datasetParams.slug}`).then(res => {
            if (res.data.status === 200) {
                console.log(res.data.get_data.photos);
                console.log(res.data.get_data.uploads);
                setFormInput(res.data.get_data);
                setStartDate(res.data.get_data.start_date_time);
                setEndDate(res.data.get_data.end_time_time);
                setPhotos(JSON.parse(res.data.get_data.photos));
                setFiles(JSON.parse(res.data.get_data.uploads));
                setLocation(JSON.parse(res.data.get_data.locations));
                setActivityType(res.data.get_data.type);
                setLinkDistrict(res.data.get_data.district_id);
                setLinkCity(res.data.get_data.city_id);
                setLinkProject(res.data.get_data.project_id);
                setTags_thematic(res.data.get_data.tags.filter(element => element.type == 1).map(element => element.name.en));
                setTags_subject(res.data.get_data.tags.filter(element => element.type == 2).map(element => element.name.en));
                setTags_extra(res.data.get_data.tags.filter(element => element.type == 3).map(element => element.name.en));

                processTags(res.data.get_data.tags);

                if (res.data.get_data.type == 2) {
                    setMediaArticle(false);
                }
                else {
                    setMediaArticle(true);
                }
            }
            else if (res.data.status === 404) {
                console.log(res.message, "message");
            }
        });
    }

    const getProjectList = () => {
        axios.get(`/api/projects-by-organization/`).then(res => {
            if (res.data.status === 200) {
                setProjectList(res.data.projects);
            }
            else if (res.data.status === 404) {
                console.log(res.message, "message");
            }
        });
    }

    const getDistrictList = () => {
        axios.get(`/api/districts`).then(res => {
            if (res.data.status === 200) {
                setDistrictList(res.data.districts);
            }
            else if (res.data.status === 404) {
                console.log(res.message, "message");
            }
        });
    }

    const getCityList = () => {
        axios.get(`/api/cities`).then(res => {
            if (res.data.status === 200) {
                setCityList(res.data.cities);
            }
            else if (res.data.status === 404) {
                console.log(res.message
                    , "message");
            }
        });
    }

    const handleInput = (e) => {
        e.persist();
        setFormInput({ ...formInput, [e.target.name]: e.target.value });
    }

    const selectLinkProject = (event) => {
        setLinkProject(event.target.value);
    }

    const selectActivityType = (event) => {
        setActivityType(event.target.value);
        if (event.target.value == 2) {
            setMediaArticle(false);
        }
        else {
            setMediaArticle(true);
        }
    };

    const selectLinkDistrict = (event) => {
        setLinkDistrict(event.target.value);
    }

    const selectLinkCity = (event) => {
        setLinkCity(event.target.value);
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

    const handleStartDate = (value) => {
        console.log(value);
        var start_date = moment(value.$d).format("YYYY-MM-DD HH:mm");
        setStartDate(start_date);
    }

    const handleEndDate = (value) => {
        console.log(value);
        var end_date = moment(value.$d).format("YYYY-MM-DD HH:mm");
        setEndDate(end_date);
    }

    //uploaders
    const getMediaFiles = (e) => {
        setPhotos(e);
    }

    const getImages = (e) => {
        setFiles(e);
    }

    const handleDocRemove = (e) => {
        setFiles(files.filter(p => p !== e));
    }

    const handleImageRemove = (e) => {
        setPhotos(photos.filter(p => p !== e));
    }
    //end uploaders


    const lanlat = (value) => {
        setLocation(value);
    }

    const createActivity = (e) => {
        e.preventDefault();
        const user_id = localStorage.getItem('auth_id');
        const data = {
            user_id: user_id,
            type: activityType,
            project_id: linkProject,
            organization_id: '',
            title: formInput.title,
            start_date_time: startDate,
            end_time_time: endDate,
            description: formInput.description,
            overview: formInput.overview,
            route: formInput.route,
            locations: locations,
            uploads: files, //files
            photos: photos,   //photos
            district_id: linkDistrict,
            city_id: linkCity,
            tags_thematic: tags_thematic,
            tags_subject: tags_subject,
            tags_extra: tags_extra,
            level1: thematics.level1,
            level2: thematics.level2,
            level3: thematics.level3,
            level4: thematics.level4,
            other_tags_subject: otherTags.subject.map((option) => option.id),
            other_tags_extra: otherTags.extra.map((option) => option.id)
        }
        console.log(data);
        if (thematics.level1 === null || thematics.level1 === undefined || thematics.level1 === "") {
            setAlert(true);
            setAlertType('error');
            setAlertContent('Please select a level 1 tag');
            return;
        }
        axios.put(`/api/update-whatson/${datasetParams.slug}`, data).then(res => {
            if (res.data.status === 200) {
                setAlert(true);
                setAlertType('success');
                setAlertContent(res.data.message);
                setError([]);
            }
            else if (res.data.status === 422) {
                console.log(res.data);
                setError(res.data.errors);
                setSnackAlert({
                    type: 'error',
                    'message': JSON.stringify(res.data.errors),
                    'error': JSON.stringify(res.data.errors),
                });
                setAlertOpen(true);
            }
            else {
                console.log(res.data.errors);
                setSnackAlert({
                    type: 'error',
                    'message': JSON.stringify(res.data.errors),
                    'error': JSON.stringify(res.data.errors),
                });
                setAlertOpen(true);
            }
        });
    }

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
        if (formInput?.description) {
            editorConfig.editorState = formInput?.description;
            setEditorInitialConfig(editorConfig);
        }
    }, [formInput?.description]);

    const onChange = (editorState) => {
        editorState.read(() => {
            setFormInput({ ...formInput, description: JSON.stringify(editorState) });
        });
    }

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

    //======== end tagging system

    return (
        <MainLayout title={"Edit Whats' on"}>
            <MenuTab />
            <Box component={"form"} onSubmit={createActivity}>
                <Grid container>
                    <Grid item md={12} lg={8}>
                        <Grid sx={{ marginBottom: 4 }}>
                            <Typography variant="span" style={{ color: '#666', fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                                Create events, volunteer opportunities or articles</Typography>
                        </Grid>

                        <FormControl className="form-group">
                            <InputLabel id="activity-type-label">Activity Type</InputLabel>
                            <Select
                                labelId="activity-type-label"
                                fullWidth
                                id="activity-type"
                                value={activityType}
                                label="Action Type"
                                onChange={selectActivityType}
                            >
                                <MenuItem value={1}>Event</MenuItem>
                                <MenuItem value={2}>Media Article</MenuItem>
                                <MenuItem value={3}>Volunteer Opportunity</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl className="form-group">
                            <TextField
                                type='text'
                                fullWidth
                                label="Title"
                                name="title"
                                onChange={handleInput}
                                value={formInput.title}
                            />
                        </FormControl>

                        <FormGroup className="form-group">
                            <TextField
                                multiline
                                rows={4}
                                type='text'
                                fullWidth
                                label="Overview"
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
                            <InputLabel id="project-type-label">Project</InputLabel>
                            <Select
                                labelId="project-type-label"
                                id="project-type"
                                value={linkProject}
                                label="Project"
                                onChange={selectLinkProject}
                            >
                                {projectList.map(row => <MenuItem key={row.id} value={row.id}>{row.project_title}</MenuItem>)}
                            </Select>
                        </FormControl>

                        {editorInitialConfig.length !== 0 && <EditorEdit
                            initialConfig={editorInitialConfig}
                            onChange={onChange}
                        />}



                        {/* <FormControl className="form-group">
                            <InputLabel id="city-label">City *</InputLabel>
                            <Select
                                labelId="city-label"
                                id="city"
                                value={linkCity}
                                label="City"
                                onChange={selectLinkCity}
                            >
                                {cityList.map(row => <MenuItem key={row.id} value={row.id}>{row.name_en}</MenuItem>)}
                            </Select>
                        </FormControl> */}

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <FormGroup className="form-group">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            label="Date&Time picker"
                                            value={startDate}
                                            onChange={handleStartDate}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </LocalizationProvider>
                                    <Typography variant="span">{error.start_date}</Typography>
                                </FormGroup></Grid></Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <FormGroup className="form-group">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            label="Date&Time picker"
                                            value={endDate}
                                            onChange={handleEndDate}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </LocalizationProvider>
                                    <Typography variant="span">{error.start_date}</Typography>
                                </FormGroup></Grid></Grid>


                        {mediaArticle && (
                            <div style={{ marginBottom: 30 }}>
                                <FormGroup className="form-group">
                                    <TextField
                                        type='text'
                                        fullWidth
                                        label="Route"
                                        name="route"
                                        onChange={handleInput}
                                        value={formInput.route}
                                    />
                                    {/* <Typography variant="span">{error.email}</Typography> */}
                                </FormGroup>

                                <FormControl className="form-group">
                                    <InputLabel id="district-label">District *</InputLabel>
                                    <Select
                                        labelId="district-label"
                                        id="district"
                                        value={linkDistrict}
                                        label="District"
                                        onChange={selectLinkDistrict}
                                    >
                                        {districtList.map(row => <MenuItem key={row.id} value={row.id}>{row.name_en}</MenuItem>)}
                                    </Select>
                                </FormControl>

                                <Map zoom={8} center={{ lat: 7.873054, lng: 80.771797 }} getLanLat={lanlat} listLangLat={locations} />
                            </div>
                        )}

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
                        {/* <FileUploader setSelectedFiles={getImages}  /> */}
                        <FileUploader setSelectedFiles={getImages} files={files} />
                        <Grid container spacing={2} sx={{ 'marginBottom': 6 }}>
                            {files && files.length > 0 && files.map((item, index) => {
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
                        <ImageUploader setSelectedFiles={getMediaFiles} />
                        <Grid container spacing={2} sx={{ 'marginBottom': 8 }}>
                            {photos?.map((element, index) => (
                                <Grid key={index} item xs={4} className="photo-preview">
                                    <Button onClick={() => handleImageRemove(element)} className="remove-btn">
                                        <img src={`../../../../images/remove-icon.png`} />
                                    </Button>
                                    <img src={`/storage/` + element} />
                                </Grid>
                            ))}
                        </Grid>

                        {/* <ThematicTags getThematicTags={tagsThematic} setThematicTag={tags_thematic} />

                        <SubjectTags getSubjectTags={tagsSubject} setSubjectTag={tags_subject} />

                        <ExtraTags getExtraTags={tagsExtra} setExtraTag={tags_extra} /> */}

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
                            className="user__theme-btn">
                            Update Whats on
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

export default EditWhatson
