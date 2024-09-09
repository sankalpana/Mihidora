import React from "react";
//import { Link } from "react-router-dom";
import { Link, withRouter, useNavigate } from 'react-router-dom';
import { Container, AppBar, Toolbar, List, ListItem, ListItemButton, ListItemText, Menu, Grid, Typography, Stack, Alert } from "@mui/material";
import OffcanvasMenu from '../components/OffcanvasMenu';
import LogoutLink from '../../../components/Dashboard/components/LogoutLink';
import Logo from "../../../../images/logo.png";
// import menuImg from "../../../../images/menu-img.jpg";
import menuImg from "../../../../images/whatson-menu.jpg";
import exploreImg from "../../../../images/explore-menu.jpg";
import dataTab from "../../../../../public/images/data-tab.jpg";
import eLearningTab from "../../../../../public/images/elearning.jpg";
import projAndOrgTab from "../../../../../public/images/proj-and-org-tab.jpg";
import resourceTab from "../../../../../public/images/resources-tab.jpg";




const isLogin = () => {
	if (localStorage.getItem('auth_token')) {
		if (localStorage.getItem('user_role') == 2) {
			return <div className="auth-link-wrap"><Link to="/dashboard" className="theme-btn login-btn">My Profile</Link></div>
		} else if (localStorage.getItem('user_role') == 1) {
			// return <div className="auth-link-wrap"><Link to="" className="theme-btn login-btn">Logout</Link></div>
			return <LogoutLink />;
		} else {
			// return <div className="auth-link-wrap"><Link to="" className="theme-btn login-btn">Logout</Link></div>
			return <LogoutLink />;
		}
	} else {
		return <div className="auth-link-wrap"><Link to="/register-as" className="theme-btn signup-btn">Sign Up</Link>
			<Link to="/login" className="theme-btn login-btn">Login</Link></div>
	}
}


function Header() {
	const [anchorExploreNav, setAnchorExploreNav] = React.useState(null);
	const [anchorProjectNav, setAnchorProjectNav] = React.useState(true);
	const [anchorDataNav, setAnchorDataNav] = React.useState(false);
	const [anchorResourceNav, setResourceNav] = React.useState(false);
	const [anchorElearningeNav, setElearningNav] = React.useState(false);
	const [anchorWhatsonNav, setAnchorWhatsonNav] = React.useState(null);

	const navigate = useNavigate();

	const logoutSubmit = (e) => {
		e.preventDefault();

		axios.post('/api/logout').then(res => {
			if (res.data.status === 200) {
				localStorage.removeItem('auth_id');
				localStorage.removeItem('auth_token');
				localStorage.removeItem('auth_name');
				localStorage.clear();
				console.log(localStorage.getItem('auth_id'));
				navigate('/login');
			}
		});
	}

	const handleExploreClick = (event) => {
		if (anchorExploreNav !== event.currentTarget) {
			setAnchorExploreNav(event.currentTarget);
		}
	}
	function handleExploreClose() {
		setAnchorExploreNav(null);
	}

	const handleProjectClick = () => {
		setAnchorProjectNav(true);
		setAnchorDataNav(false);
		setResourceNav(false);
		setElearningNav(false);
	}

	const handleDataClick = () => {
		setAnchorDataNav(true);
		setAnchorProjectNav(false);
		setResourceNav(false);
		setElearningNav(false);
	}

	const handleResourceClick = () => {
		setResourceNav(true);
		setAnchorProjectNav(false);
		setAnchorDataNav(false);
		setElearningNav(false);
	}

	const handlElearningClick = () => {
		setElearningNav(true);
		setResourceNav(false);
		setAnchorProjectNav(false);
		setAnchorDataNav(false);
	}

	const handleWhatsonClick = (event) => {
		if (anchorWhatsonNav !== event.currentTarget) {
			setAnchorWhatsonNav(event.currentTarget);
		}
	}
	function handleWhatsonClose() {
		setAnchorWhatsonNav(null);
	}

	return (
		<AppBar position={"static"} className="site-header">
			{/* <Stack sx={{ width: '100%', position:'fixed', zIndex: 100 }} spacing={2} >
                <Alert severity="warning" sx={{ backgroundColor: '#ffe496'}}>
                    mihidora.lk is currently undergoing essential updates to enhance your browsing experience. Please be advised that you may encounter temporary disruptions during this period. Our website will be back to normal functionality shortly.
                </Alert>
            </Stack> */}
			<OffcanvasMenu />
			{/* <Container className="trgap" sx={{ marginTop: '60px' }}> */}
			<Container className="trgap">

			</Container>
			<Toolbar>
				<Container>
					<Link to="/"><img src={Logo} className="brand" /></Link>

					{isLogin()}

					<nav className="main-menu-wrap">
						<List>
							<ListItem disablePadding>
								<ListItemButton component="a" to="/topics" sx={{ 
									'&.MuiListItemButton-root' : {
										color: 'black !important',
									}
								 }}>
									<ListItemText primary="Explore" />
								</ListItemButton>
							</ListItem>
							<ListItem disablePadding>
								<ListItemButton component="a"
									onClick={handleExploreClick}
									onMouseEnter={handleExploreClick}
									onMouseLeave={anchorExploreNav == false}
									sx={{ 
										'&.MuiListItemButton-root' : {
											color: 'black !important',
										}
									 }}
								>
									<ListItemText primary="Topics" />
								</ListItemButton>
							</ListItem>
							<ListItem disablePadding>
								<ListItemButton component="a"
									onClick={handleWhatsonClick}
									onMouseEnter={handleWhatsonClick}
									onMouseLeave={anchorWhatsonNav == false}
									sx={{ 
										'&.MuiListItemButton-root' : {
											color: 'black !important',
										}
									 }}
								>
									<ListItemText primary="What's on" />
								</ListItemButton>
							</ListItem>
							<ListItem disablePadding>
								<ListItemButton component="a" to="/map" sx={{ 
									'&.MuiListItemButton-root' : {
										color: 'black !important',
									}
								 }}>
									<ListItemText primary="Map" />
								</ListItemButton>
							</ListItem>
							<ListItem disablePadding>
								<ListItemButton component="a" to="/about" sx={{ 
									'&.MuiListItemButton-root' : {
										color: 'black !important',
									}
								 }}>
									<ListItemText primary="About us" />
								</ListItemButton>
							</ListItem>
						</List>
					</nav>

					<Menu
						className="explore-submenu"
						anchorEl={anchorExploreNav}
						open={Boolean(anchorExploreNav)}
						MenuListProps={{ onMouseLeave: handleExploreClose }}
					>
						<Container>
							<Grid container py={8} className="mega-menu">
								<Grid item sm={12} md={3} className="nav-links">
									<Typography fontWeight={600} fontSize={20}>Topics</Typography>
									<List>
										<ListItem disablePadding>
											<ListItemButton component="a"
												onMouseEnter={handleProjectClick}
											>
												<ListItemText primary="Organisations & Projects" />
											</ListItemButton>
										</ListItem>
										<ListItem disablePadding>
											<ListItemButton component="a"
												onMouseEnter={handleDataClick}
											>
												<ListItemText primary="Data" />
											</ListItemButton>
										</ListItem>
										
										<ListItem disablePadding>
											<ListItemButton component="a"
												onMouseEnter={handleResourceClick}
											>
												<ListItemText primary="Resource Exchange" />
											</ListItemButton>
										</ListItem>
										
										<ListItem disablePadding>
											<ListItemButton component="a"
												to="/elearning-materials"
												onMouseEnter={handlElearningClick}
											>
												<ListItemText primary="E-learning" sx={{ color: 'black !important' }} />
											</ListItemButton>
										</ListItem>
									</List>
								</Grid>
								<Grid item sm={12} md={9} className="nav-content">

									{anchorProjectNav === true && (
										<Grid container flex sx={{ alignItems: 'center' }} spacing={4}>
											<Grid item sm={12} md={4}>
												<ul>
													<li><Link to="/projects">Projects</Link></li>
													<li><Link to="/organizations">Organisations</Link></li>
												</ul>
											</Grid>
											<Grid item sm={12} md={4}>
												<img src={projAndOrgTab} />
											</Grid>
											<Grid item sm={12} md={4}></Grid>
										</Grid>
									)}
									{anchorDataNav === true && (
										<Grid container flex sx={{ alignItems: 'center' }} spacing={4}>
											<Grid item sm={12} md={4}>
												<ul>
													<li><Link to="/datahub">Data Catalogue</Link></li>
													{/* <li><Link to="/">All Data Sets</Link></li> */}
												</ul>
											</Grid>
											<Grid item sm={12} md={4}>
												<img src={dataTab} />
											</Grid>
											<Grid item sm={12} md={4} mt={0}>
												<Typography >All in one page for Sri Lanka's environmental Data</Typography>
											</Grid>
										</Grid>
									)}
									{anchorResourceNav === true && (
										<Grid container flex sx={{ alignItems: 'center' }} spacing={4}>
											<Grid item sm={12} md={4}>
												<ul>
													<li><Link to="/resource-exchange/jobs">Jobs</Link></li>
													<li><Link to="/resource-exchange/grants-and-proposals">Grants and RFPs</Link></li>
													<li><Link to="/resource-exchange/suppliers">Suppliers</Link></li>
													<li><Link to="/resource-exchange/resource-sharing">Resource pool</Link></li>
												</ul>
											</Grid>
											<Grid item sm={12} md={4}>
												<img src={resourceTab} />
											</Grid>
											<Grid item sm={12} md={4} mt={0}>
												<Typography>All in one page for Sri Lanka's environmental Resources</Typography>
											</Grid>
										</Grid>
									)}
									{anchorElearningeNav === true && (
										<Grid container flex sx={{ alignItems: 'center' }} spacing={4}>
											<Grid item sm={12} md={4}>

											</Grid>
											<Grid item sm={12} md={4}>
												<img src={eLearningTab} />
											</Grid>
											<Grid item sm={12} md={4} mt={0}>
												<Typography>All in one page for Sri Lanka's environmental education programs</Typography>
											</Grid>
										</Grid>
									)}

								</Grid>
							</Grid>
						</Container>
					</Menu>
					{/* Explore sub menu */}

					<Menu
						className="explore-submenu"
						anchorEl={anchorWhatsonNav}
						open={Boolean(anchorWhatsonNav)}
						MenuListProps={{ onMouseLeave: handleWhatsonClose }}
					>
						<Container>
							<Grid container py={8} className="mega-menu">
								<Grid item sm={12} md={3} className="nav-links">
									<Typography fontWeight={600} fontSize={20}>What's On</Typography>
									<List>
										<ListItem disablePadding>
											<ListItemButton component="a"
												to="/whatson/events"
												onMouseEnter={handleProjectClick}
											>
												<ListItemText primary="Events" />
											</ListItemButton>
										</ListItem>
										<ListItem disablePadding>
											<ListItemButton component="a"
												to="/whatson/volunteer-opportunities"
												onMouseEnter={handleDataClick}
											>
												<ListItemText primary="Volunteer Opportunities" />
											</ListItemButton>
										</ListItem>
										<ListItem disablePadding>
											<ListItemButton component="a"
												to="/whatson/media-and-advocacy"
												onMouseEnter={handleResourceClick}
											>
												<ListItemText primary="Media and Advocacy" />
											</ListItemButton>
										</ListItem>
									</List>
								</Grid>
								<Grid item sm={12} md={9} className="nav-content">

									{anchorProjectNav === true && (
										<Grid container flex sx={{ alignItems: 'center' }} spacing={4}>
											<Grid item sm={12} md={4}>
												<img src={menuImg} />
											</Grid>
											<Grid item sm={12} md={8} mt={0}>
												<Typography >All in one page for Sri Lanka's environmental Data</Typography>
											</Grid>
										</Grid>
									)}
									{anchorDataNav === true && (
										<Grid container flex sx={{ alignItems: 'center' }} spacing={4}>
											<Grid item sm={12} md={4}>
												<img src={menuImg} />
											</Grid>
											<Grid item sm={12} md={8} mt={0}>
												<Typography >All in one page for Sri Lanka's environmental Data</Typography>
											</Grid>
										</Grid>
									)}
									{anchorResourceNav === true && (
										<Grid container flex sx={{ alignItems: 'center' }} spacing={4}>
											<Grid item sm={12} md={4}>
												<img src={menuImg} />
											</Grid>
											{/* <Grid item sm={12} md={4}>
												<img src={menuImg} />
											</Grid> */}
											<Grid item sm={12} md={8} mt={0}>
												<Typography>All in one page for Sri Lanka's environmental Data</Typography>
											</Grid>
										</Grid>
									)}
									{anchorElearningeNav === true && (
										<Grid container flex sx={{ alignItems: 'center' }} spacing={4}>
											<Grid item sm={12} md={4}>

											</Grid>
											<Grid item sm={12} md={4}>
												<img src={menuImg} />
											</Grid>
											<Grid item sm={12} md={4} mt={0}>
												<Typography>All in one page for Sri Lanka's environmental Data</Typography>
											</Grid>
										</Grid>
									)}

								</Grid>
							</Grid>
						</Container>
					</Menu>
					{/* Whatson sub menu */}

				</Container>

			</Toolbar>
		</AppBar>
	)
}

export default Header