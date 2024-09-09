import React, { useState } from 'react';
import { Button, Modal, TextField, Typography, Chip, Box, CircularProgress } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert sx={{
        backgroundColor: '#93aa40',
        '&.MuiPaper-root-MuiAlert-root': {
            backgroundColor: '#93aa40 !important'
        }
    }} elevation={6} ref={ref} variant="filled" {...props} />;
});

const styles = {
    unsubscribed: {
        backgroundColor: '#ffffff',
        border: 'solid 1px #93aa40',
        color: '#93aa40',
        '&.MuiButtonBase-root-MuiChip-root .MuiChip-deleteIcon': {
            color: '#93aa40 !important'
        }
    }
}

const PublicSubscriptionComponent = ({ topic, title }) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(`Error Occurred, please try again`)

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setLoading(false);
    };

    const handleToastClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setToastOpen(false);
    };
    const handleErrorToastClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setError(false);
    };

    const handleFormSubmit = (e) => {
        // Call your API here
        // For illustration purposes, let's use a blank function
        // Replace the following line with your actual API call
        e.preventDefault();
        apiCall();
        setLoading(true);
    };

    const apiCall = () => {
        // Your API call logic goes here
        let data = {
            "email": email,
            "name": name,
            "topic": topic
        }
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post('/api/subscribe-public', data).then(res => {
                console.log(res)
                if (res.status == 200) {
                    if (res.data.status == 400) {
                        setLoading(false);
                        setErrorMessage(res.data.message);
                        setError(true);
                    } else {
                        setLoading(false);
                        setToastOpen(true);
                        handleClose();
                    }
                } else {
                    setLoading(false);
                    setErrorMessage('Error Occurred, please try again');
                    setError(true);
                }
            });
        });
        // console.log(data);
        // setTimeout(() => {
        //     setToastOpen(true);
        //     handleClose();
        // }, 3000);
    };

    return (
        <div>
            <Chip
                sx={styles.unsubscribed}
                label={`Subscribe to ${title}`}
                onClick={handleOpen}
                onDelete={handleOpen}
                deleteIcon={<NotificationsActiveIcon sx={{ color: '#93aa40 !important' }} />}
            />
            <Snackbar sx={{
                '&.MuiPaper-root-MuiAlert-root': {
                    backgroundColor: '#93aa40 !important'
                }
            }} anchorOrigin={{ horizontal: 'right', vertical: 'top' }} open={toastOpen} onClose={handleToastClose} autoHideDuration={5000}>
                <Alert onClose={handleToastClose} severity="success" sx={{ width: '100%', backgroundColor: '#93aa40 !important' }}>
                    Successfully subscribed to {title}
                </Alert>
            </Snackbar>
            <Snackbar anchorOrigin={{ horizontal: 'right', vertical: 'top' }} open={error} onClose={handleErrorToastClose} autoHideDuration={5000}>
                <Alert onClose={handleErrorToastClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
            <Modal
                open={open}
                onClose={handleClose}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div
                    style={{
                        backgroundColor: 'white',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                        padding: '16px',
                        outline: 'none',
                    }}
                >
                    <Box mb={2} sx={{ minHeight: '200px !important', backgroundImage: `url(${"../../../images/newsletter.jpg"})`, backgroundSize: 'cover' }}>
                    </Box>
                    <Typography variant="h2" sx={{ fontSize: '1.75rem' }}>Subscribe to "{title}"</Typography>
                    <Typography variant="caption" display="block" gutterBottom sx={{ maxWidth: '400px' }}>
                        *Please note this function has not yet been enabled. However, you can still submit your email address. You will start receiving updates when the alert system is enabled at a future date. 
                    </Typography>
                    <form onSubmit={handleFormSubmit}>
                        <TextField
                            label="Name"
                            variant="standard"
                            margin="normal"
                            fullWidth
                            type='text'
                            required
                            small
                            InputLabelProps={{
                                style: { fontSize: 14 }
                            }}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            label="Email"
                            variant="standard"
                            margin="normal"
                            fullWidth
                            type='email'
                            required
                            small
                            InputLabelProps={{
                                style: { fontSize: 14 }
                            }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button type="submit" variant="contained" color="primary" sx={{
                            borderRadius: '24px',
                            fontSize: '12px',
                            minWidth: '100px',
                            float: 'right',
                            backgroundColor: '#93aa40',
                            '&:hover': {
                                backgroundColor: 'black'
                            },
                        }}>
                            Submit
                        </Button>
                        {loading ?
                            <Box sx={{ minHeight: '46px' }}>
                                <CircularProgress color="success" />
                            </Box>
                            : ""}
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default PublicSubscriptionComponent;
