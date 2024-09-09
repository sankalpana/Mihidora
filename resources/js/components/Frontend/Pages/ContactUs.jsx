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
    Chip
} from "@mui/material";
import BaseLayout from "../BaseLayout";
import PageBanner from "../components/PageBanner";
import ButtonBase from '@mui/material/ButtonBase';
import AddButton from '../components/AddButton';

import bannerImage from "../../../../images/aboutBanner.jpg";
import aboutFEO_img from "../../../../images/about_img_1.jpg";
import ProjIMG from "../../../../images/project.jpg";


function ContactUs() {

    const [form, setForm] = useState({
        type: '',
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

    useEffect(() => {

    }, []);

    return (
        <BaseLayout title={"Support"}>
            <div className="single-post-title-section">
                {/* <PageBanner image={bannerImage} /> */}
                <Container>
                    <Grid container mt={3}>
                        <Grid item sm={12} md={12} lg={6} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Stack>
                                <Typography variant="h1" sx={{ fontWeight: '500' }}>{'Contact Us'}</Typography>
                                <Typography sx={{ fontSize: '16px' }}>
                                    {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco */}
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item sm={12} md={12} lg={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <CardMedia
                                component="img"
                                height="300"
                                image={`../../../images/contact-us.png`}
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
                                noValidate
                                autoComplete="off"
                            >
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
                                    />
                                    <TextField
                                        name={'email'}
                                        value={form.email}
                                        error={formErrors.email}
                                        id="outlined-error"
                                        label="Email"
                                        defaultValue={''}
                                        helperText={errorMessages.email}
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
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Chip
                                        label={'Submit Inquiry'}
                                        component="a"
                                        href={''}
                                        variant="outlined"
                                        clickable
                                        sx={{
                                            border: 'solid 2px #93aa40',
                                            color: '#93aa40',
                                        }}
                                    />
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

        </BaseLayout>
    )
}

export default ContactUs