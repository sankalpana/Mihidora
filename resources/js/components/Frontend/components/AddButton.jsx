import React, { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

function AddButton(props) {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('auth_token')) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    return (
        isLoggedIn ?
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', display: { xs: 'none', md: 'flex' } }}>
                <Typography mr={2}>{props.title}</Typography>
                <Chip
                    label={props.linkLabel}
                    component="a"
                    href={props.link}
                    variant="outlined"
                    clickable
                    sx={{
                        border: 'solid 2px #93aa40',
                        color: '#93aa40',
                    }}
                />
            </Stack>
            : <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Typography mr={2}>{props.title}</Typography>
                <Chip
                    label={props.linkLabel}
                    component="a"
                    href={props.link}
                    variant="outlined"
                    clickable
                    sx={{
                        border: 'solid 2px #93aa40',
                        color: '#93aa40',
                    }}
                />
            </Stack>
    )
}

export default AddButton