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


function FAQ() {

    return (
        <BaseLayout title={"Support"}>
            <div className="single-post-title-section">
                {/* <PageBanner image={bannerImage} /> */}
                <Container>
                    <Grid container mt={3}>
                        <Grid item sm={12} md={12} lg={12} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Stack sx={{ maxWidth: '800px' }}>
                                <Typography variant="h1" sx={{ fontWeight: '500' }}>{'FAQ'}</Typography>
                                <Typography sx={{ fontSize: '16px' }}>
                                    In this FAQ page we have tried to answer as many questions as possible. However, you still can reach out to us via the <a href="/get-support" >"Get Support"</a> page for additional information.
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
                                <Typography sx={{ fontSize: '16px' }} className="faq-question">
                                    What is Mihidora?
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }} className="faq-answer">
                                    Mihidora is an open source website, it is your go-to destination for providing data, toolkits, and resources for conservation and environmental initiatives. Our mission is to bring together data, information, and tools in one convenient online platform.
                                </Typography>

                                <Typography sx={{ fontSize: '16px' }} className="faq-question">
                                    What does Mihidora offer organizations?
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }} className="faq-answer">
                                    <ul>
                                        <li>Projects tab - share information about past and ongoing projects within an organization, including details like location and contacts.</li>
                                        <li>What’s On tab - share information on events, volunteer opportunities and upcoming media and advocacy related initiatives .</li>
                                        <li>The Data Tab - store and share important data.</li>
                                        <li>E-learning hub - share and access educational content.</li>
                                        <li>The Resource Exchange tab - to share vacancies, funding opportunities, and supplier information for environmental initiatives.</li>
                                    </ul>
                                </Typography>

                                <Typography sx={{ fontSize: '16px' }} className="faq-question">
                                    Who can join Mihidora?
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }} className="faq-answer">
                                    Any institutions and organizations that work in the environmental field, as well as individuals who have conducted environmental projects and have significant resources to share. Click [provide link for profile creation] to create a profile.
                                </Typography>

                                <Typography sx={{ fontSize: '16px' }} className="faq-question">
                                    Why do we need to provide a registration number during the registration process
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }} className="faq-answer">
                                    This is for proof of legal standing. There are some university-linked organisations that do not have registration. In circumstances like these, you can still submit your registration application by entering the name of the associated parent organisation (in text) in the registration number field during the sign-up process. We kindly request that you complete this field instead of leaving it empty, as it is a required field. Once we have reviewed and verified the registration details, we will gladly accept the organization profile.
                                </Typography>

                                <Typography sx={{ fontSize: '16px' }} className="faq-question">
                                    How long does it take for a profile review
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }} className="faq-answer">
                                    Within 2 business days. 
                                </Typography>

                                <Typography sx={{ fontSize: '16px' }} className="faq-question">
                                    How do I know if my profile is approved or rejected
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }} className="faq-answer">
                                    You will receive an email with our response. 
                                </Typography>
                                
                                <Typography sx={{ fontSize: '16px' }} className="faq-question">
                                    I need to upload a large document. How can I upload this?
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }} className="faq-answer">
                                    Please choose "Submit a larger file" if you need to submit a file that is larger than the allowed size. You can paste a link to the file you need to upload into the text box where you can add a URL. The file will be reviewed and added on your behalf when you submit the form, which our team will do. Links from services like Dropbox, Google Drive, OneDrive, etc. may be included. Please check that the link has been given permission so that our team can access and download the files.
                                </Typography>

                                <Typography sx={{ fontSize: '16px' }} className="faq-question">
                                    How to get technical support?
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }} className="faq-answer">
                                    If you encounter any technical issues while using Mihidora, please fill out our technical enquiry form. <a href="https://mihidora.lk/get-support">https://mihidora.lk/get-support</a>
                                </Typography>

                                <Typography sx={{ fontSize: '16px' }} className="faq-question">
                                    I have a general inquiry: who should I contact?
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }} className="faq-answer">
                                    If you encounter any general issues while using Mihidora, please fill out our general enquiry form. <a href="https://mihidora.lk/get-support">https://mihidora.lk/get-support</a>
                                </Typography>

                                <Typography sx={{ fontSize: '16px' }} className="faq-question">
                                    How do I know my information in secured and my privacy is protected
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }} className="faq-answer">
                                    Your security and privacy are our top priorities. Please review the policies listed below to learn how we make sure your information is safeguarded and maintained.
                                    <ul>
                                        <li><a href="">Privacy Policy</a></li>
                                        <li><a href="">Terms & Conditions</a></li>
                                        <li><a href="">Code of Conduct</a></li>
                                    </ul>
                                    Data will not be shared to third parties, we won’t be sharing personally identifiable information. The portal will be secured with SSL and all data will be handled in a secure manner both in transit and store.
                                </Typography>

                                <Typography sx={{ fontSize: '16px' }} className="faq-question">
                                    How do I suggest changes to this website?
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }} className="faq-answer">
                                    You can provide your suggestions via the Mihidora GitHub repository - https://github.com/FEO-LK/Mihidora
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

export default FAQ