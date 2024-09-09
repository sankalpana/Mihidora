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
import ImageCarousalBanner from './ImageCarousalBanner';
import ImageCarousal from './ImageCarousal';

function CarousalContainer() {

    let originalImages = [
        "2024/02/0212202408584265c9ddc299023.jpeg",
        "2023/10/10282023104433653ce6118ea72.jpeg",
        "2023/11/1104202313543865464d1ee0cdb.jpeg"
    ];

    const [imagePaths, setImagePaths] = useState([]);

    useEffect(() => {
        const paths = originalImages.map(image => `/storage/${image}`);
        setImagePaths(paths);
    }, [originalImages]);

    return (
        <div id="datasets" style={{height: '400px'}}>
            {/* <ImageCarousalBanner images={imagePaths}/> */}
            <ImageCarousalBanner images={imagePaths}/>
        </div>
    );
}

export default CarousalContainer;