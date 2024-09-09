import React, { useState, useEffect } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainLayout from "../BaseLayout";
import {
    Container,
    Grid,
    FormGroup,
    TextField,
    Button,
    MenuItem,
    Snackbar,
    FormControl,
    InputLabel,
    Select,
    FormLabel
} from "@mui/material";
// import axios from 'axios';
import swal from 'sweetalert';
import UserMenu from "../components/submenus/UserMenu";
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';

import TagsLevel1 from './TagsLevel1';
import TagsLevel2 from './TagsLevel2';
import TagsLevel3 from "./TagsLevel3";
import TagsLevel4 from "./TagsLevel4";
import SubjectTags from "./SubjectTags";
import ExtraTags from "./ExtraTags";

function AddL3Tags() {

    const [value, setValue] = useState({
        title: '',
    });
    const [level, setLevel] = useState('');
    const [level1, setLevel1] = useState([]);
    const [level2, setLevel2] = useState([]);
    const [selectedl2, setSelectedl2] = useState([]);
    const [error, setError] = useState({
        title: false,
        submission: true,
    });
    const [loading, setLoading] = useState(false);

    const addTag = (data) => {
        axios.post('/api/add-tag', data).then(res => {
            if (res.data.status === 200) {
                console.log(res.data)
            }
            else if (res.data.status === 422) {
                console.log(res.data);
            }
            else {
                console.log(res.data);
            }
        });
    }

    useEffect(() => {
        console.log('Loading')
        getL1Tags();
    }, []);

    const getL1Tags = () => {
        const data = {
            'level': 1
        };
        axios.post('/api/get-tags', data).then(res => {
            if (res.status == 200) {
                // setLoading(false);
                console.log(res.data);
                let l1tags = res.data.tags.map((tag) => {
                    return {
                        id: tag.id,
                        name: tag.name,
                        slug: tag.slug,
                        weight: { weight: tag.weight, id: tag.id },
                        update: { weight: tag.weight, id: tag.id },
                    };
                });
                setLevel1(l1tags);
            }
        });
    }

    const getL2Tags = (data) => {
        axios.post('/api/get-tags', data).then(res => {
            if (res.status == 200) {
                // setLoading(false);
                console.log(res.data);
                let l2tags = res.data.tags.map((tag) => {
                    return {
                        id: tag.id,
                        name: tag.name,
                        slug: tag.slug,
                        weight: { weight: tag.weight, id: tag.id },
                        update: { weight: tag.weight, id: tag.id },
                    };
                });
                setLevel2(l2tags);
            }
        });
    }

    const handleChange = (event) => {
        console.log(event.target.value);
        setLevel(event.target.value);
        getL2Tags({
            'level': 2,
            'parent': event.target.value
        });
    };

    const handleLevel2Change = (event) => {
        setSelectedl2(event.target.value);
        console.log(event);
    }

    const handleInput = (e) => {
        e.persist();
        setValue({ ...value, [e.target.name]: e.target.value });
    };

    const submitForm = (e) => {
        e.preventDefault();
        addTag({
            "name": value.title,
            "level": 3,
            "parent": selectedl2
        });
        // console.log({
        //     "name": value.title,
        //     "level": 3,
        //     "parent": selectedl2
        // });
    }

    return (
        <MainLayout>
            <Box sx={{ width: '100%', typography: 'body1' }} component={"form"} onSubmit={submitForm}>
                <div className="topic-title-section">
                    <Container>
                        <Grid container>
                            <Grid item lg={12}>
                                <Typography sx={{ mt: 2 }} variant="subtitle1">Projects</Typography>
                            </Grid>
                            <Grid item lg={6}>
                                <FormControl sx={{ minWidth: 200 }} size="small">
                                    <Select
                                        value={level}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value='-1'>Any</MenuItem>
                                        {level1.map((tag) => {
                                            return <MenuItem value={tag.id}>{tag.name}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>

                                <FormControl sx={{ minWidth: 200 }} size="small">
                                    <Select
                                        value={selectedl2}
                                        onChange={handleLevel2Change}
                                    >
                                        <MenuItem value='-1'>Any</MenuItem>
                                        {level2.map((tag) => {
                                            return <MenuItem value={tag.id}>{tag.name}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>

                                <FormGroup className="form-group" sx={{ mt: 2 }}>
                                    <TextField
                                        type='text'
                                        fullWidth
                                        label="Title *"
                                        name="title"
                                        onChange={handleInput}
                                        value={value.title}
                                    />
                                    <Typography variant="span">{error.title}</Typography>
                                </FormGroup>

                                <Button
                                    sx={{ mt: 1 }}
                                    variant={"outlined"}
                                    type={"submit"}
                                    className="user__theme-btn">
                                    Add Data Hub
                                </Button>
                            </Grid>
                        </Grid>
                    </Container>
                </div>
            </Box>
        </MainLayout>
    )
}

export default AddL3Tags;