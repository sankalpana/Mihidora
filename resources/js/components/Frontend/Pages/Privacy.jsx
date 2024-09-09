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


function Privacy() {

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
                                <Typography variant="h1" sx={{ fontWeight: '500' }}>{'Mihidora Privacy Policy'}</Typography>
                                <Typography sx={{ fontSize: '16px' }}>
                                    At MIHIDORA Environment Portal, accessible from mihidora.lk, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by MIHIDORA Environment Portal and how we use it.
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
                                    If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect on the MIHIDORA Environment Portal. This policy is not applicable to any information collected offline or via channels other than this website.
                                </Typography>

                                <Typography variant="h2" sx={{ fontWeight: '500', mt: 3 }}>{'Consent'}</Typography>
                                <Typography sx={{ fontSize: '16px' }}>
                                    By using our website, you hereby consent to our Privacy Policy and agree to its terms.
                                </Typography>

                                <Typography variant="h2" sx={{ fontWeight: '500', mt: 3 }}>{'Information we collect'}</Typography>
                                <Typography sx={{ fontSize: '16px' }}>
                                    The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.
                                </Typography>

                                <Typography variant="h2" sx={{ fontWeight: '500', mt: 3 }}>{'How we use your information'}</Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    We use the information we collect in various ways, including to:
                                    <ul>
                                        <li>Provide, operate, and maintain our website</li>
                                        <li>Improve, personalize, and expand our website</li>
                                        <li>Understand and analyze how you use our website</li>
                                        <li>Develop new products, services, features, and functionality</li>
                                        <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
                                        <li>Send you emails</li>
                                        <li>Find and prevent fraud</li>
                                    </ul>
                                </Typography>


                                <Typography variant="h2" sx={{ fontWeight: '500', mt: 3 }}>{'Log Files'}</Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    MIHIDORA Environment Portal follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
                                </Typography>

                                <Typography variant="h2" sx={{ fontWeight: '500', mt: 3 }}>{'Cookies and Web Beacons'}</Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    Like any other website, MIHIDORA Environment Portal uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
                                </Typography>

                                <Typography variant="h2" sx={{ fontWeight: '500', mt: 3 }}>{'Advertising Partners Privacy Policies'}</Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    You may consult this list to find the Privacy Policy for each of the advertising partners of MIHIDORA Environment Portal.
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on MIHIDORA Environment Portal, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    Note that MIHIDORA Environment Portal has no access to or control over these cookies that are used by third-party advertisers.
                                </Typography>

                                <Typography variant="h2" sx={{ fontWeight: '500', mt: 3 }}>{'Third Party Privacy Policies'}</Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    MIHIDORA Environment Portal's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.
                                </Typography>

                                <Typography variant="h2" sx={{ fontWeight: '500', mt: 3 }}>{'GDPR Data Protection Rights'}</Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    The right to access – You have the right to request copies of your personal data. We may charge you a small fee for this service.
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    The right to rectification – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    The right to erasure – You have the right to request that we erase your personal data, under certain conditions.
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
                                </Typography>

                                <Typography variant="h2" sx={{ fontWeight: '500', mt: 3 }}>Children's Information</Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
                                </Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    Mihidora Environment Portal does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
                                </Typography>

                                <Typography variant="h2" sx={{ fontWeight: '500', mt: 3 }}>Changes to This Privacy Policy</Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately, after they are posted on this page.
                                </Typography>

                                <Typography variant="h2" sx={{ fontWeight: '500', mt: 3 }}>Contact Us</Typography>
                                <Typography sx={{ fontSize: '16px', mt: 1 }}>
                                    If you have any questions or concerns about the Privacy Policy, please contact us at admin@mihidora.lk.
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

export default Privacy