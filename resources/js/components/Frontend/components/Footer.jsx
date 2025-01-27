import React from "react";
import {Grid, Container, Typography, List, ListItem, Link } from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import PublicSubscriptionAll from './PublicSubscriptionAll';

function Footer() {

	return (
		<Grid container className="site-footer">
			<Container>
				<Grid container>
					<Grid item sm={4} md={3} className="ft-col">
						<Typography variant="h4" className="footer-title">Our team</Typography>
						<nav aria-label="secondary mailbox folders">
							<List>
								<ListItem>
									<Link href="/about">About Us</Link>
								</ListItem>
								<ListItem>
									<Link href="https://feosrilanka.org/">About FEO</Link>
								</ListItem>
								<ListItem>
									<Link href="/projects">Our Projects</Link>
								</ListItem>
								<ListItem>
									<Link href="/organizations">Our Members</Link>
								</ListItem>
								<ListItem>
									<Link href="/faq">FAQ</Link>
								</ListItem>
								<ListItem>
									<Link href="/contact">Contact Us</Link>
								</ListItem>
							</List>
						</nav>
					</Grid>
					<Grid item sm={4} md={3} className="ft-col">
						<Typography variant="h4" className="footer-title">Explore</Typography>
						<nav aria-label="secondary mailbox folders">
							<List>
								<ListItem>
									<Link href="/organizations">Organisations</Link>
								</ListItem>
								<ListItem>
									<Link href="/projects">Projects</Link>
								</ListItem>
								<ListItem>
									<Link href="/datahub">Data</Link>
								</ListItem>
								<ListItem>
									<Link href="#">Resource Exchange</Link>
								</ListItem>
								<ListItem>
									<Link href="/elearning-materials">E-learning</Link>
								</ListItem>
							</List>
						</nav>
					</Grid>
					<Grid item sm={12} md={6}>
						<Typography variant="h4" className="footer-title">Subscribe to get latest updates</Typography>
						{/* <SubscriptionForm/> */}
						<PublicSubscriptionAll topic="All Topics" title="All Topics" />
					</Grid>
				</Grid>	
				<Grid container className="copyright-row">
					<Grid item sm={12} md={8}>
						<Typography variant="span" className="copyright">&copy; 2021-{new Date().getFullYear()} mihidora.lk All rights reserved</Typography>
						<nav aria-label="secondary mailbox folders">
							<List>
								<ListItem>
									<Link href="/terms">Terms of Services</Link>
								</ListItem>
								<ListItem>
									<Link href="/privacy">Privacy Policy</Link>
								</ListItem>
								<ListItem>
									<Link href="/copyright">Copyright</Link>
								</ListItem>
								<ListItem>
									<Link href="/code-of-conduct">Code of Conduct</Link>
								</ListItem>
							</List>
						</nav>
					</Grid>
					<Grid item sm={12} md={4}>
						<List className="social-link">
							<ListItem><a href="https://www.facebook.com/feosrilanka/" target="_blank"><FacebookIcon /></a></ListItem>
							<ListItem><a href="https://twitter.com/feosrilanka" target="_blank"><TwitterIcon /></a></ListItem>
							<ListItem><a href="https://www.instagram.com/federationofenvironmentalorgsl/" target="_blank"><InstagramIcon /></a></ListItem>
						</List>
					</Grid>
				</Grid>	
			</Container>
		</Grid>
	)
}

export default Footer