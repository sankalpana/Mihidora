import React from 'react';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Tooltip from '@mui/material/Tooltip';
import {
    Typography,
} from "@mui/material";

export default function Collborators({ organizations }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
        }}>
            <Typography sx={{ fontSize: '12px' }}>Project Collborators</Typography>
            <AvatarGroup max={4} sx={{
                            '.MuiAvatar-root': {
                                backgroundColor: '#93aa3f !important'
                            }
                        }}>
                {organizations.map((organization) => (
                    <Tooltip key={organization.id} title={organization.org_name} arrow>
                        <Avatar>
                            {organization.org_name.charAt(0).toUpperCase()}
                        </Avatar>
                    </Tooltip>
                ))}
            </AvatarGroup>
        </div>

    );
}
