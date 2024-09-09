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


function Code() {

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
                                <Typography variant="h1" sx={{ fontWeight: '500' }}>{'Mihidora Code of Conduct'}</Typography>
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
                                    Introduction
                                </Typography>
                                <Typography sx={{ fontSize: '16px' }}>
                                    This code of conduct applies to all content on the Mihidora platform
                                </Typography>
                                <Typography sx={{ fontSize: '16px' }}>
                                    We expect everyone who participates in this Mihidora community formally or informally, or claims any affiliation with the Platform, in any Platform-related activities or when representing the larger environmental community in any role, to honour this code of conduct.
                                </Typography>
                                <Typography sx={{ fontSize: '16px' }}>
                                    This code is not exhaustive or complete. It distills our common understanding of a collaborative, shared environment and goals. We expect all members of the Mihidora community to follow it in spirit as much as in the letter, so that it can enrich all of us and the larger environmental  communities in which we participate.
                                </Typography>

                                <Typography variant="h2" sx={{ fontWeight: '500', mt: 3 }}>
                                    Specific Guidelines
                                </Typography>
                                <Typography sx={{ fontSize: '16px' }}>
                                    We strive to:
                                    <ol>
                                        <li style={{marginTop:'16px'}}><b>Be responsible.</b> Members are under an obligation to treat all information with care by keeping it secure, limiting access to those who have a need to know in order to do their job, and avoiding the discussion of confidential information. We also have an obligation to handle our users’ personal information responsibly. Not only is this necessary to comply with privacy laws, but also key to maintaining our users’ trust. Mihidora believes that our communications should accurately reflect our brand. This means taking responsibility for what you publish or post, ensuring accuracy at all times.</li>
                                        <li style={{marginTop:'16px'}}><b>Be open.</b> We invite anyone to participate in our community. We prefer to use public methods of communication for project-related messages, unless discussing something sensitive. This applies to messages for help or project-related support, too; not only is a public support request much more likely to result in an answer to a question, it also makes sure that the community notices and corrects any inadvertent mistakes people answering the query may make.</li>
                                        <li style={{marginTop:'16px'}}><b>Be empathetic, welcoming, friendly, and patient.</b> We work together to share information, resolve conflicts, assume good intentions, and do our best to act in an empathetic fashion. We may all experience some frustration from time to time, but we do not allow frustration to result in a personal attack. A community where people feel uncomfortable or threatened is not a productive one. We should be respectful when dealing with other community members as well as with people outside our community.</li>
                                        <li style={{marginTop:'16px'}}><b>Be collaborative.</b> Other people will use our work, and we in turn depend on the work of others. When we share something for the benefit of the community, we are willing to explain to others how it works, so they can build on the work to make it even better. Any decision we make will affect users and colleagues, and we take those consequences seriously when making decisions.</li>
                                        <li style={{marginTop:'16px'}}><b>Be inquisitive.</b> Nobody knows everything! Asking questions early avoids many problems later, so we encourage questions, although we may redirect them to the appropriate forum. Those who receive a question should be responsive and helpful, within the context of our shared goal of improving the Mihidora platform and the environmental community at large.</li>
                                        <li style={{marginTop:'16px'}}><b>Be careful in the words that we choose.</b> 
                                            Whether we are participating as professionals or volunteers, we value professionalism in all interactions, and take responsibility for our own speech. Be kind to others. Do not insult or put down other participants. Harassment and other exclusionary behaviour are not acceptable. This includes, but is not limited to:
                                            <ul>
                                                <li style={{marginTop:'16px'}}>Violent threats or language directed against another person.</li>
                                                <li style={{marginTop:'16px'}}>Sexist, racist, or otherwise discriminatory jokes and language.</li>
                                                <li style={{marginTop:'16px'}}>Posting sexually explicit or violent material.</li>
                                                <li style={{marginTop:'16px'}}>Posting (or threatening to post) other people's personally identifying information ("doxing").</li>
                                                <li style={{marginTop:'16px'}}>Sharing private content, such as emails sent privately or non-publicly, or from unlogged forums such as IRC channel history.</li>
                                                <li style={{marginTop:'16px'}}>Personal insults, especially those using racist or sexist terms.</li>
                                                <li style={{marginTop:'16px'}}>Unwelcome sexual attention.</li>
                                                <li style={{marginTop:'16px'}}>Excessive or unnecessary profanity.</li>
                                                <li style={{marginTop:'16px'}}>Repeated harassment of others. In general, if someone asks you to stop, then stop.</li>
                                                <li style={{marginTop:'16px'}}>Advocating for, or encouraging, any of the above behaviour.</li>
                                            </ul>
                                        </li>
                                        <li style={{marginTop:'16px'}}><b>Step down considerately.</b> Members of every project come and go. When somebody leaves or disengages from the platform they should tell people they are leaving and take the proper steps to ensure that others can pick up where they left off. In doing so, they should remain respectful of those who continue to participate in the platform and should not misrepresent the platform's goals or achievements. Likewise, community members should respect any individual's choice to leave the platform.</li>
                                        
                                    </ol>
                                </Typography>

                                <Typography variant="h2" sx={{ fontWeight: '500', mt: 3 }}>
                                    Diversity Statement
                                </Typography>
                                <Typography sx={{ fontSize: '16px' }}>
                                    Mihidora welcomes and encourages participation by everyone within the larger environmental community. We are committed to being a community that everyone feels good about joining. Although we may not be able to satisfy everyone, we will always work to treat everyone well.
                                </Typography>
                                <Typography sx={{ fontSize: '16px' }}>
                                    No matter how you identify yourself or how others perceive you, we welcome you. Though no list can hope to be comprehensive, we explicitly honour diversity in age, culture, ethnicity, genotype, gender identity or expression, language, national origin, neurotype, phenotype, political beliefs, profession, race, religion, sexual orientation, socioeconomic status, subculture and technical ability.
                                </Typography>
                                <Typography sx={{ fontSize: '16px' }}>
                                    We welcome people fluent in all three languages of Sri Lanka, However, the main form of communication adopted by the Mihidora platform will take place in English.
                                </Typography>
                                <Typography sx={{ fontSize: '16px' }}>
                                    The Code of Conduct, above, details our standards for behaviour in the Mihidora community. We expect participants in our community to meet these standards in all their interactions and to help others to do so.
                                </Typography>
                                
                                <Typography variant="h2" sx={{ fontWeight: '500', mt: 3 }}>
                                    Reporting Guidelines
                                </Typography>
                                <Typography sx={{ fontSize: '16px' }}>
                                    While all participants should adhere to this code of conduct, we recognize that sometimes people may have a bad day, or be unaware of some of the code's guidelines. When that happens, you may reply to them and point out this code of conduct. Such messages may be in public or in private, whatever is most appropriate. However, regardless of whether the message is public or not, it should still adhere to the relevant parts of this code of conduct; in particular, it should not be abusive or disrespectful.
                                </Typography>
                                <Typography sx={{ fontSize: '16px' }}>
                                    While all participants should adhere to this code of conduct, we recognize that sometimes people may have a bad day, or be unaware of some of the code's guidelines. When that happens, you may reply to them and point out this code of conduct. Such messages may be in public or in private, whatever is most appropriate. However, regardless of whether the message is public or not, it should still adhere to the relevant parts of this code of conduct; in particular, it should not be abusive or disrespectful.
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

export default Code