import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ProjectsByOrg from './ProjectsByOrg';
import ResourcesByOrg from './ResourcesByOrg';
import DataSetByOrg from './DataSetByOrg';
import OrgContactDetails from './OrgContactDetails';
import OrgWhatsOn from './OrgWhatsOn';
import OrgELearning from './OrgELearning';

function OrganizationContent(props) {
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example" TabIndicatorProps={{
                        style: {
                            backgroundColor: "#93AA40",
                        }
                    }}>
                        <Tab label="Projects" value="1" sx={{
                            "&.Mui-selected": {
                                color: "black",
                                fontWeight: "bold"
                            }
                        }} />
                        <Tab label="Datasets" value="2" sx={{
                            "&.Mui-selected": {
                                color: "black",
                                fontWeight: "bold"
                            }
                        }} />
                        <Tab label="Resources" value="3" sx={{
                            "&.Mui-selected": {
                                color: "black",
                                fontWeight: "bold"
                            }
                        }} />
                        <Tab label="What's On" value="5" sx={{
                            "&.Mui-selected": {
                                color: "black",
                                fontWeight: "bold"
                            }
                        }} />
                        <Tab label="E-Learning" value="6" sx={{
                            "&.Mui-selected": {
                                color: "black",
                                fontWeight: "bold"
                            }
                        }} />
                        <Tab label="Contact Details" value="4" sx={{
                            "&.Mui-selected": {
                                color: "black",
                                fontWeight: "bold"
                            }
                        }} />
                    </TabList>
                </Box>
                <TabPanel value="1"><ProjectsByOrg slug={props.slug} /></TabPanel>
                <TabPanel value="2"><DataSetByOrg slug={props.slug} /></TabPanel>
                <TabPanel value="3"><ResourcesByOrg slug={props.slug} /></TabPanel>
                <TabPanel value="4"><OrgContactDetails slug={props} /></TabPanel>
                <TabPanel value="5"><OrgWhatsOn slug={props.slug} /></TabPanel>
                <TabPanel value="6"><OrgELearning slug={props.slug} /></TabPanel>
                
            </TabContext>
        </Box>
    );
}

export default OrganizationContent;