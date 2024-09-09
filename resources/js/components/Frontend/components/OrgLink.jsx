import React from "react";
import { Grid, Stack } from "@mui/material";
import Box from '@mui/material/Box';
import { Link } from "react-router-dom";
import Typography from '@mui/material/Typography';


const styles = {
    boxLayout: {
        textAlign: 'center'
    },
    linkText: {
        fontSize: '12px'
    },
    projectIcon: {
        width: '48px',
        height: '48px',
        borderRadius: '40px',
        backgroundColor: '#93aa40',
        color: '#ffffff',
        fontWeight: '600',
        fontSize: '24px',
        border: 'solid 4px #c5d396',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
}

function OrgLink(props) {

    return (
        <Link to={props.link} className="iconLink">
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', display: 'flex' }}>
                <div style={styles.projectIcon}>{props.initial}</div>
                <Typography mr={2}>{props.name}</Typography>
            </Stack>
        </Link>
    )
}

export default OrgLink