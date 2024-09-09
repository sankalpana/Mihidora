import React, { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import {
    Container,
    Grid,
    Typography,
    Stack,
    Box,
    Link,
    CardMedia,
    Divider,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Chip,
    Button,
    Snackbar,
    Alert,
    Backdrop, CircularProgress
} from "@mui/material";
import BaseLayout from "../BaseLayout";
import PageBanner from "../components/PageBanner";
import ButtonBase from '@mui/material/ButtonBase';
import AddButton from '../components/AddButton';

import bannerImage from "../../../../images/aboutBanner.jpg";
import aboutFEO_img from "../../../../images/about_img_1.jpg";
import ProjIMG from "../../../../images/project.jpg";


function Support() {

    const [form, setForm] = useState({
        type: 0,
        name: '',
        email: '',
        mobile: '',
        message: '',
    })

    const [formErrors, setFormErrors] = useState({
        type: false,
        name: false,
        email: false,
        mobile: false,
        message: false,
    })

    const [errorMessages, setErrorMessages] = useState({
        type: '',
        name: '',
        email: '',
        mobile: '',
        message: '',
    })

    const [loading, setLoading] = useState(false);

    useEffect(() => {

    }, []);

    const handleInput = (e) => {
        e.persist();
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleRadioChange = (e) => {
        setForm((prevForm) => ({
            ...prevForm,
            type: e.target.value,
        }));
    };

    const submitForm = (e) => {
        e.preventDefault();
        console.log(form);
        const data = {
            'type': form.type,
            'full_name': form.name,
            'email': form.email,
            'phone': form.mobile,
            'description': form.message,
        }
        addInquiry(data);
    }

    const addInquiry = (data) => {
        setLoading(true);
        axios.post(`/api/add-inquiry`, data).then(res => {
            // console.log(res);
            if (res.data.status === 200) {
                setSnackAlert({
                    type: 'success',
                    'message': "Inquiry Submitted",
                    'error': "Inquiry Submitted",
                });
                setLoading(false);
                setAlertOpen(true);
                setForm({
                    type: 0,
                    name: '',
                    email: '',
                    mobile: '',
                    message: '',
                })
            } else if (res.data.status === 400) {
                setSnackAlert({
                    type: 'error',
                    'message': JSON.stringify(res.data.error),
                    'error': JSON.stringify(res.data.error),
                });
                setLoading(false);
                setAlertOpen(true);
            } else {
                setSnackAlert({
                    type: 'error',
                    'message': JSON.stringify(res.data.error),
                    'error': JSON.stringify(res.data.error),
                });
                setLoading(false);
                setAlertOpen(true);
            }
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

    const handleClose = () => {
        setLoading(false);
    }

    return (
        <BaseLayout title={"Support"}>
            <div className="single-post-title-section">
                {/* <PageBanner image={bannerImage} /> */}
                <Container>
                    <Grid container mt={3}>
                        <Grid item sm={12} md={12} lg={6} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Stack>
                                <Typography variant="h1" sx={{ fontWeight: '500' }}>{'Get in Touch'}</Typography>
                                <Typography sx={{ fontSize: '16px' }}>
                                    {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco */}
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item sm={12} md={12} lg={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <CardMedia
                                component="img"
                                height="300"
                                image={`../../../images/mihidora-pot.png`}
                                alt="Help Image"
                                loading="lazy"
                                sx={{ width: '300px', display: { xs: 'none', md: 'none', lg: 'block' } }}
                            />
                        </Grid>
                    </Grid>
                </Container>
                <Container>
                    <Grid container mt={3} mb={2}>
                        <Grid item sm={12} md={12} lg={12}>
                            <Divider />
                        </Grid>
                    </Grid>
                </Container>
                {/* Support Form */}
                <Container>
                    <Grid container mt={3} mb={2}>
                        <Grid item sm={12} md={12} lg={12}>
                            <Box
                                component="form"
                                sx={{
                                    '& .MuiTextField-root': { m: 1, width: '50ch' },
                                    margin: 'auto',
                                }}
                                autoComplete="off"
                                onSubmit={submitForm}
                            >
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                                    <FormControl>
                                        <FormLabel sx={{
                                            '&. MuiFormLabel-root.Mui-focused': {
                                                color: '#93aa40'
                                            },
                                            fontSize: '12px'
                                        }} id="demo-row-radio-buttons-group-label">Type of Inquiry</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            value={form.type}
                                            onChange={handleRadioChange}
                                            required
                                        >
                                            <FormControlLabel value="0" control={<Radio color="success" />} label="General Inquiry" />
                                            <FormControlLabel value="1" control={<Radio color="success" />} label="Tech Support" />
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <TextField
                                        fullWidth
                                        name={'name'}
                                        value={form.name}
                                        error={formErrors.name}
                                        id="outlined-error"
                                        label="Your Name"
                                        defaultValue={''}
                                        helperText={errorMessages.name}
                                        onChange={handleInput}
                                        required
                                    />
                                    <TextField
                                        name={'email'}
                                        value={form.email}
                                        error={formErrors.email}
                                        id="outlined-error"
                                        label="Email"
                                        defaultValue={''}
                                        helperText={errorMessages.email}
                                        onChange={handleInput}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>

                                    <TextField
                                        name={'mobile'}
                                        value={form.mobile}
                                        error={formErrors.mobile}
                                        id="outlined-error-helper-text"
                                        label="Phone"
                                        defaultValue=""
                                        helperText={errorMessages.mobile}
                                        onChange={handleInput}
                                        required
                                    />
                                    <TextField
                                        multiline
                                        rows={4}
                                        name={'message'}
                                        value={form.message}
                                        error={formErrors.message}
                                        id="outlined-error-helper-text"
                                        label="Message"
                                        defaultValue=""
                                        helperText={errorMessages.message}
                                        onChange={handleInput}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    {/* <Chip
                                        label={'Submit Inquiry'}
                                        variant="outlined"
                                        clickable
                                        type={"submit"}
                                        sx={{
                                            border: 'solid 2px #93aa40',
                                            color: '#93aa40',
                                        }}
                                        // onClick={submitForm}
                                    /> */}
                                    <Button
                                        type={"submit"}
                                        sx={{
                                            border: 'solid 2px #93aa40',
                                            color: '#93aa40',
                                        }}
                                    >
                                        Add Project
                                    </Button>
                                </div>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container mt={3}>
                        <Grid item sm={12} md={12} lg={6} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Stack>
                                {/* <Typography variant="h1" sx={{ fontWeight: '500' }}>{'Contact Us'}</Typography> */}
                                <Typography sx={{ fontSize: '16px' }}>
                                    <p>Federation of Environmental Organizations (FEO)</p>
                                    <p>49/8, Fife Road, Colombo 5</p>
                                    <p>+94 77 444 3796</p>
                                    <p>admin@mihidora.lk</p>
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item sm={12} md={12} lg={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>

                        </Grid>
                    </Grid>
                </Container>
                {/* End Support Form */}
                <Container>
                    <Grid container mt={3} mb={2}>
                        <Grid item sm={12} md={12} lg={12}>
                            <Divider />
                        </Grid>
                    </Grid>
                </Container>
                <Container>
                    <Grid container mt={3}>
                        <Grid item sm={12} md={12} lg={12} sx={{ display: 'flex', justifyContent: 'flex-center', alignItems: 'center' }}>
                            <Stack>
                                <Typography variant="h1" sx={{ fontWeight: '500' }}>{'FAQ'}</Typography>
                                <Typography sx={{ fontSize: '16px' }}>
                                    Please refer to our FAQ section for any questions or queries you have. The FAQ section is designed to provide quick and concise answers to common inquiries. It covers a variety of topics and can be a valuable resource for resolving common issues or finding information about our services
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
                <Container>
                    <Grid container mt={3} mb={2}>
                        <Grid item sm={12} md={12} lg={12} sx={{ display: 'flex', justifyContent: 'flex-center', alignItems: 'center' }}>
                            <Chip
                                label={'Read FAQ'}
                                component="a"
                                href={'/faq'}
                                variant="outlined"
                                clickable
                                sx={{
                                    border: 'solid 2px #93aa40',
                                    color: '#93aa40',
                                }}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </div>


            {loading ?
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={open}
                    onClick={handleClose}
                >
                    <CircularProgress color="success" />
                </Backdrop>
                : ''
            }

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

        </BaseLayout>
    )
}

export default Support