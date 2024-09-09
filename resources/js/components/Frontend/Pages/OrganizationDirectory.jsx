import React, { useEffect, useState } from "react";
import { Container, Grid, Typography, Box, Divider, Backdrop, CircularProgress } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import BaseLayout from "../BaseLayout";
import PageBanner from "../components/PageBanner";

import bannerImage from "../../../../images/aboutBanner.jpg";
import aboutFEO_img from "../../../../images/about_img_1.jpg";
import ProjIMG from "../../../../images/project.jpg";

const styles = {
    TopProject: {
        backgroundImage: `url(${"../../../../images/project.jpg"})`
    }
};

function OrganizationDirectory() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const handleClose = () => setLoading(false);
    useEffect(() => {
        loadCounters();
    }, []);

    const loadCounters = () => {
        setLoading(true);
        axios.get('/api/get-org-by-type').then(res => {
            console.log(res);
            if (res.data.status == 200) {
                console.log(res.data);
                setData(res.data.organizations);
                setLoading(false);
            } else {
                // handle the error
                console.log(res.data);
                setLoading(false);
            }
        });
    }

    return (
        <BaseLayout className="home-page" title={"Home page"}>
            <div className="static-wrapper">
                <div className="banner-containers">
                    <Grid container spacing={2}>
                        <Grid item lg={12} className="banner-grids">
                            <Box className="banner-box" sx={{ textAlign: "center" }}>
                                <img src="../../../../images/mihidora-artwork-log-variant.png" />
                                <Typography mb={2} className="banner-h1" variant="h1">Join our thriving network where collaboration fuels success. Your organization belongs here!</Typography>
                                <a className="banner-buttons" href="/register-as">Join Mihidora</a>
                            </Box>
                        </Grid>
                    </Grid>
                </div>

                <Container sx={{ marginTop: '48px' }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        // alignItems: 'center',
                    }}>
                        {data.map((organizationType) => (
                            <Grid item xs={12} key={organizationType.id}>
                                <Typography variant="h5" gutterBottom sx={{ marginTop: '32px' }}>
                                    {organizationType.type}
                                </Typography>
                                <Divider sx={{
                                    marginBottom: '16px'
                                }} />
                                <Grid container spacing={3}>
                                    {organizationType.organizations.map((organization) => (
                                        <Grid item xs={12} key={organization.id}>
                                            <Link className="iconLink" to={`/organization/${organization.slug}`} sx={{ color: 'inherit' }} >
                                                <Typography variant="body1">{organization.org_name}</Typography>
                                            </Link>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        ))}
                    </Box>
                </Container>

                {/* <div className="footer-banner" style={styles.footerBanner}>
                    <Grid container spacing={2}>
                        <Grid item lg={12} className="banner-grids">
                            <Box className="footer-banner-box">
                                <Typography className="banner-h1" variant="h1" sx={{ mb: 2, maxWidth: '90%', margin: '1rem auto' }}>
                                    Let's Unite to Save Sri Lanka's Environment!
                                </Typography>
                                <a className="banner-buttons" href="/register-as">Join Mihidora</a>
                            </Box>
                        </Grid>
                    </Grid>
                </div> */}

            </div>
            {loading ?
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={open}
                    onClick={handleClose}
                >
                    <CircularProgress color="success" />
                </Backdrop>
                : ''
            }
        </BaseLayout>
    )
}

export default OrganizationDirectory