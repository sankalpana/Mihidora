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


function Copyright() {

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
                        <Grid item sm={12} md={12} lg={12} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Stack sx={{ maxWidth: '800px' }}>
                                <Typography variant="h1" sx={{ fontWeight: '500' }}>{'Mihidora Copyright Notice'}</Typography>
                                <Typography sx={{ fontSize: '16px' }}>
                                    General copyright provided below:
                                </Typography>
                                <Typography sx={{ fontSize: '16px' }}>
                                    Copyright © 2023 Mihidora. All rights reserved.
                                </Typography>

                            </Stack>
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
                <Container>
                    <Grid container mt={3}>
                        <Grid item sm={12} md={12} lg={12} sx={{ display: 'flex', justifyContent: 'flex-center', alignItems: 'center' }}>
                            <Stack sx={{ maxWidth: '800px' }}>
                                <Typography sx={{ fontSize: '16px' }}>
                                    Content, including text, images, graphics, and other media, on this website is the property of Mihidora and is protected by [Sri Lankan Law/ Section/ Jurisdiction] or in the event such material is provided by the users of the site, such material shall belong to the rights holder of such copyright material.
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    All content is displayed on the site for informational and personal use only and may not be modified, reproduced, transmitted, or otherwise exploited for any commercial purpose. The content may be used and distributed for educational and knowledge purpose as long as Mihidora or the original author is acknowledged.
                                </Typography>

                                <Typography sx={{ fontSize: '16px' }}>
                                    You may not modify, publish, transmit, participate in the transfer or sale of, create derivative works from, distribute, display, or in any way exploit any of the content, in whole or in part.
                                </Typography>

                                <Typography sx={{ fontSize: '16px' }}>
                                    If you believe that any content on this website infringes upon your copyright, please contact us at admin@mihidora.lk
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    Mihidora respects the intellectual property rights of others and expects our users to do the same. Unauthorized use of any content from this website may violate copyright, trademark, and other laws.
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    For permissions or inquiries regarding the use of content on this website, please contact us at admin@mihidora.lk
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    Last updated: Nov 9, 2023
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
                <Container>
                    <Grid container mt={3} mb={2}>
                        <Grid item sm={12} md={12} lg={12} sx={{ display: 'flex', justifyContent: 'flex-center', alignItems: 'center' }}>
                        </Grid>
                    </Grid>
                </Container>
            </div>

        </BaseLayout>
    )
}

export default Copyright