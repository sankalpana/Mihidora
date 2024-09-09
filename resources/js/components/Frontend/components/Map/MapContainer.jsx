// FullScreenDialogPage.js
import React, { useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import Map from './Map';

const MapContainer = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Open Full Screen Dialog
            </Button>
            <Dialog fullScreen open={open} onClose={handleClose} disableEnforceFocus>
                <DialogTitle>
                    <Typography variant="h6">Full Screen Dialog</Typography>
                    <IconButton sx={{ position: 'absolute', right: '20px', top: '10px', zIndex:2000, color: 'white !important', '&.MuiSvgIcon-root':{color: 'white'} }} edge="end" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent disablePadding sx={{ paddingLeft: '0px', paddingRight: '0px'}}>
                    <Map />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MapContainer;
