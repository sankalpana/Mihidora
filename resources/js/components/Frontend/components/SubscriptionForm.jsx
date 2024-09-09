import React, { useState, useEffect } from "react";
import { Grid, Container, Box, TextField, Typography, Chip, Button, Backdrop, CircularProgress } from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

function SubscriptionForm() {
    const [registerInput, setRegisterInput] = useState({
        error_list: {
            email: ''
        },
        email: '',
        disabled: false,
        error_list: '',
        alert: false,
        alert_message: ''
    });
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };
    const registerSubmit = (e) => {
        setOpen(true);
        // e.preventdefault();
        console.log(registerInput);
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post('/api/subscribe-to-email', { "email": registerInput.email }).then(res => {
                if (res.data.status === 200) {
                    setRegisterInput({ ...registerInput, loading: false });
                    setOpen(false);
                }
                else if (res.data.status === 401) {
                    setOpen(false);
                    setRegisterInput({ ...registerInput, alert: true, alert_message: res.data.message });
                } else {
                    setOpen(false);
                    setRegisterInput({ ...registerInput, error_list: res.data.validation_errors });
                }
            });
        });
    }
    const handleInput = (e) => {
        e.persist();
        setRegisterInput({
            ...registerInput,
            [e.target.name]: e.target.value,
            error_list: {
                [e.target.name]: false
            }
        });
    }
    return (
        <Grid container>
            <Container>
                <Grid container>
                    <Grid item sm={12} md={12}>
                        <Box component={"form"} onSubmit={registerSubmit}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Stay up to date with Mihidora
                            </Typography>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <TextField
                                    type='email'
                                    margin="normal"
                                    error={registerInput.error_list.email}
                                    helperText={registerInput.error_list.email}
                                    required
                                    label="Email"
                                    InputLabelProps={{
                                        style: { fontSize: 14 }
                                    }}
                                    name="email"
                                    onChange={handleInput}
                                    value={registerInput.email}
                                    fullWidth
                                    variant="filled"
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            '&.Mui-focused': {
                                                color: '#93aa40'
                                            }
                                        },
                                        '& .MuiFilledInput-root': {
                                            backgroundColor: '#ffffff42'
                                        },
                                        '& .MuiInputBase-input-MuiFilledInput-input': {
                                            color: 'white'
                                        }
                                    }}
                                />
                                <Button
                                    variant={"outlined"}
                                    // type={"submit"}
                                    sx={{ mt: 3, mb: 2 }}
                                    style={{ margin: '20px auto 10px' }}
                                    className="theme-btn"
                                    disabled={registerInput.disabled}
                                    onClick={registerSubmit}
                                >
                                    Subscribe
                                </Button>
                                {/* <Chip label="Clickable" variant="outlined" onClick={registerSubmit} /> */}
                            </div>
                        </Box>
                    </Grid>
                </Grid>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={open}
                    onClick={handleClose}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Container>
        </Grid>
    )
}

export default SubscriptionForm