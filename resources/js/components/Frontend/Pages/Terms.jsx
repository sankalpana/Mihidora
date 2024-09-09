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


function Terms() {

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
                                <Typography variant="h1" sx={{ fontWeight: '500' }}>{'Mihidora Terms and Conditions '}</Typography>
                                {/* <Typography sx={{ fontSize: '16px' }}>
                                    At MIHIDORA Environment Portal, accessible from mihidora.lk, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by MIHIDORA Environment Portal and how we use it.
                                </Typography> */}

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
                                <Typography variant="h2" sx={{ fontWeight: '500', mt: 3 }}>
                                    1. Acceptance of Terms
                                </Typography>
                                <Typography sx={{ fontSize: '16px' }}>
                                    By accessing and using Mihidora(hereinafter referred to as the ‘site’ or ‘website’), you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these Terms, please refrain from using the Website.
                                </Typography>
                                <Typography variant="h2" sx={{ fontWeight: '500', mt: 3 }}>
                                    2. Acceptable Use
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    Please don't hesitate to explore our website and, when possible, contribute content to it, like questions, posts, and various media such as images and videos
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    Nevertheless, when using the website and sharing content on it, it's important to adhere to legal and non-offensive standards. Please be cautious not to:
                                    <ul>
                                        <li>
                                        (a) Violate someone else's privacy rights;
                                        </li>
                                        <li>
                                        (b) Infringe on any intellectual property rights;
                                        </li>
                                        <li>
                                        (c) Make defamatory statements (including those directed towards Mihidora), engage in sharing pornographic material, exhibit racism or xenophobia, promote hate, violence, or disorder;
                                        </li>
                                        <li>
                                            (d) Upload files containing viruses or that might pose security risks; or
                                        </li>
                                        <li>
                                        (e) Otherwise compromise the website's integrity.
                                        </li>
                                    </ul>
                                </Typography>
                                <Typography sx={{ fontSize: '16px' }}>
                                    Keep in mind that Mihidora reserves the right to remove any content from the website that it deems potentially illegal, offensive or in violation of third party rights and/or the terms and conditions contained in this document.
                                </Typography>

                                <Typography variant="h2" sx={{ fontWeight: '500', mt: 3 }}>
                                    3. User Conduct
                                </Typography>
                                <Typography sx={{ fontSize: '16px' }}>
                                    You agree not to engage in any activity that disrupts or interferes with the functioning of the Website.
                                </Typography>
                                <Typography sx={{ fontSize: '16px' }}>
                                    You will not use the Website for any unlawful or prohibited purposes, including violating the rights of others or engaging in activities that could harm the Website or its users. Please refer to our Code of Conduct for more information.
                                </Typography>

                                <Typography variant="h2" sx={{ fontWeight: '500', mt: 3 }}>
                                    4. Privacy
                                </Typography>
                                <Typography sx={{ fontSize: '16px' }}>
                                    Your use of the Website is also governed by our Privacy Policy, which outlines how we collect, use, and protect your personal information.
                                </Typography>

                                <Typography variant="h2" sx={{ fontWeight: '500', mt: 3 }}>
                                    5. Limitation of Liability
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    While Mihidora makes every reasonable effort to ensure the accuracy of materials on our Website and to prevent disruptions, we are not responsible for inaccurate information, disruptions, discontinuance, or other events that may result in damage to you, either directly (e.g., computer failure) or indirectly (e.g., loss of profit). Any reliance on materials on this Website is done at your own risk.
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    This Website may contain links to websites outside of Mihidora. Mihidora has no control over such third-party websites, does not necessarily endorse them, and accepts no responsibility for them, including their content, accuracy, or function. Therefore, we encourage you to thoroughly review the legal notices of these third-party websites and stay informed about any changes to them.
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    If you operate a third-party website and want to link to this Website, Mihidora does not object to such linking, provided that you do not imply in any way that you are affiliated with or endorsed by Mihidora. You should refrain from using "framing" or similar practices and ensure that the link to the Website opens in a new window.
                                </Typography>

                                <Typography variant="h2" sx={{ fontWeight: '500', mt: 3 }}>
                                    6. Intellectual property and content published on the Website
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    6.1. Content provided by Mihidora
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    All intellectual property rights, including copyright and trademarks, in materials published by or on behalf of Mihidora on the Website (e.g. text and images) are owned by Mihidora or its licensors.
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    You may reproduce extracts of the Website for your own private use (i.e., non-commercial use) provided that you keep intact and respect all intellectual property rights, including any copyright notice which may appear on such content (e.g. © 2023 Mihidora).
                                </Typography>

                                <Typography sx={{ fontSize: '16px', mt: 2 }}>
                                    6.2. Content provided by You
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    As an ‘user’ of this website you too have the right to publish content on the site, however your rights to publish any material on the site is limited to publishing only such material of which you are the ‘author’ or have been licensed by the ‘author’ to publish.
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    In the event you publish any material on the site you represent to Mihidora that you are either the author of the content that you contribute to this Website or that you have the rights (i.e., have been given permission by the rights holder) and are able to contribute such content (e.g. pictures, videos, music) to the Website.
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    You further agree that such content will be treated as non-confidential, and you grant Mihidora a royalty-free, perpetual, worldwide license to use (including to disclose, reproduce, transmit, publish, or broadcast) the content you provide for purposes relating to its business.
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    Please note that Mihidora is free to decide whether or not to use  any content published by you, and reserves all rights in law to remove any content that maybe infringing of its rights or the rights of third parties.
                                </Typography>

                                <Typography sx={{ fontSize: '16px', mt: 2 }}>
                                    ‘Content provided by other users’
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    At all times please respect the rights of others, and do not copy, reproduce or publish any content provided or published by third parties on this site without first having obtained their explicit written consent. 
                                </Typography>

                                <Typography variant="h2" sx={{ fontWeight: '500', mt: 3 }}>
                                    7. Termination
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    Mihidora reserves the right to terminate or suspend your access to the website at any time.
                                </Typography>

                                <Typography variant="h2" sx={{ fontWeight: '500', mt: 3 }}>
                                    8. Disclaimer of Warranties
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    The Website is provided "as is" and without warranties of any kind, whether express or implied. Mihidora makes no representations or warranties regarding the accuracy, reliability, or availability of the Website.
                                </Typography>

                                <Typography variant="h2" sx={{ fontWeight: '500', mt: 3 }}>
                                    9. Changes to Terms
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    Mihidora reserves the right to modify or revise these Terms at any time. It is your responsibility to review these Terms periodically for changes. Your continued use of the Website following any modifications to these Terms constitutes your acceptance of those changes.
                                </Typography>

                                <Typography variant="h2" sx={{ fontWeight: '500', mt: 3 }}>
                                    10. Governing Law
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    These Terms are governed by and construed in accordance with the laws of Sri Lanka[The Jurisdiction], and any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in [The Jurisdiction].
                                </Typography>

                                <Typography variant="h2" sx={{ fontWeight: '500', mt: 3 }}>
                                    Contact Information
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    If you have any questions or concerns about these Terms and Conditions, please contact us at admin@mihidora.lk.
                                </Typography>
                                
                                <Typography sx={{ fontSize: '16px', mt: 4 }}>
                                    Last updated on Nov 9, 2023
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

export default Terms