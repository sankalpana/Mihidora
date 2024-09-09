import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Container,
    Grid,
    Typography,
    CardActions,
    CardContent,
    CardMedia,
    menuIcon,
    Box,
    TextField,
    InputAdornment,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Divider,
    Stack,
} from "@mui/material";
import Chip from '@mui/material/Chip';
import ListSkeleton8 from '../components/ListSkeleton8';
import LinkIcon from '@mui/icons-material/Link';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

function OrgContactDetails(props) {

    let [social, setSocial] = useState([]);
    let [org, setOrg] = useState({});

    useEffect(() => {
        // let social = JSON.parse(props.social_media);
        getProjectProfile();
        console.log(props);
    }, [props]);

    const getProjectProfile = () => {
        axios.get(`/api/organization/${props.slug.slug}`).then(res => {
        // axios.get(`/api/organization/feosrilanka`).then(res => {
            if (res.data.status === 200) {
                console.log(JSON.parse(res.data.get_data.social_media));
                setSocial(JSON.parse(res.data.get_data.social_media));
                setOrg(res.data.get_data);
            }
            else if (res.data.status === 404) {
                console.log(res.message);
            }
        });
    }

    return (
        <div id="datasets">
            <Container>
                <Grid item sm={12} md={6}>
                    <Typography sx={{ fontSize: '12px' }} mt={3}>Social Media</Typography>
                    <Divider sx={{ marginTop: '8px', marginBottom: '16px' }} />
                    <Stack direction="column">
                        {social.map(link => (
                            <a href={link.social_media} style={{ display: 'flex', color: '#8ea93c' }}>
                                <LinkIcon style={{ color: '#8ea93c' }} />
                                <Typography sx={{ fontSize: '14px' }} ml={1} mr={1}>{link.social_media}</Typography>
                            </a>
                        ))}
                    </Stack>
                </Grid>
                <Grid item sm={12} md={6}>
                    <Typography sx={{ fontSize: '12px' }} mt={3}>Focal Point</Typography>
                    <Divider sx={{ marginTop: '8px', marginBottom: '16px' }} />
                    <Stack direction="column">
                        <Box sx={{ display: 'flex' }}>
                            {org.contact_name_focalpoint ? (<AccountCircleIcon style={{ color: '#8ea93c' }} />) : ""}
                            <Typography sx={{ fontSize: '14px', marginBottom:'16px' }} ml={1} mr={1}>{org?.contact_name_focalpoint}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                            {org.contact_designation_focalpoint ? (<AssignmentIndIcon style={{ color: '#8ea93c' }} />) : ""}
                            <Typography sx={{ fontSize: '14px', marginBottom:'16px' }} ml={1} mr={1}>{org?.contact_designation_focalpoint}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                            {org.contact_nos_focalpoint ? (<PhoneEnabledIcon style={{ color: '#8ea93c' }} />) : ""}
                            <Typography sx={{ fontSize: '14px', marginBottom:'16px' }} ml={1} mr={1}>{org?.contact_nos_focalpoint}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                            {org.contact_email_focalpoint ? (<MailOutlineIcon style={{ color: '#8ea93c' }} />) : ""}
                            <Typography sx={{ fontSize: '14px', marginBottom:'16px' }} ml={1} mr={1}>{org?.contact_email_focalpoint}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                            {org.contact_linkedin_focalpoint ? (<MailOutlineIcon style={{ color: '#8ea93c' }} />) : ""}
                            <Typography sx={{ fontSize: '14px', marginBottom:'16px' }} ml={1} mr={1}>{org?.contact_linkedin_focalpoint}</Typography>
                        </Box>
                    </Stack>
                </Grid>
                <Grid item sm={12} md={6}>
                    <Typography sx={{ fontSize: '12px' }} mt={3}>Primary Contact</Typography>
                    <Divider sx={{ marginTop: '8px', marginBottom: '16px' }} />
                    <Stack direction="column">
                        <Box sx={{ display: 'flex' }}>
                            {org.contact_person ? (<AccountCircleIcon style={{ color: '#8ea93c' }} />) : ""}
                            <Typography sx={{ fontSize: '14px', marginBottom:'16px' }} ml={1} mr={1}>{org?.contact_person}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                            {org.contact_number ? (<PhoneEnabledIcon style={{ color: '#8ea93c' }} />) : ""}
                            <Typography sx={{ fontSize: '14px', marginBottom:'16px' }} ml={1} mr={1}>{org?.contact_number}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                            {org.email ? (<MailOutlineIcon style={{ color: '#8ea93c' }} />) : ""}
                            <Typography sx={{ fontSize: '14px', marginBottom:'16px' }} ml={1} mr={1}>{org?.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                            {org.address ? (<HomeIcon style={{ color: '#8ea93c' }} />) : ""}
                            <Typography sx={{ fontSize: '14px', marginBottom:'16px' }} ml={1} mr={1}>{org?.address}</Typography>
                        </Box>
                    </Stack>
                </Grid>
            </Container>
        </div>
    );
}

export default OrgContactDetails;