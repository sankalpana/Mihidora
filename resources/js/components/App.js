import React from "react";
import ReactDOM from "react-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Protected } from "./ProtectedRoute/ProtectedRoute";
import { SuperUserRoute } from "./ProtectedRoute/SuperUserRoute";

import ScrollToTop from './ScrollToTop'; 

/** Frontend */
import HomeNew from './Frontend/HomeNew';
import NewAboutPage from './Frontend/Pages/NewAboutPage';
import OrganizationDirectory from './Frontend/Pages/OrganizationDirectory';
import FullMap from './Frontend/Pages/FullMap';
import OrganizationListNew from './Frontend/Organisations/OrganizationListNew';
// import OrganizationSingle from './Frontend/Organisations/OrganizationSingle';
import OrganizationResources from './Frontend/Organisations/OrganizationResources';
import OrganizationDatasets from './Frontend/Organisations/OrganizationDatasets';
import OrganizationClassified from './Frontend/Organisations/OrganizationClassified';

import SinglePostNew from './Frontend/Projects/SinglePostNew';
import SingleOrganization from './Frontend/Projects/SingleOrganization';
import ProjectMap from './Frontend/Projects/ProjectMap';
import ElearningListNew from './Frontend/Elearning/ElearningListNew';
import ElearningSingleNew from './Frontend/Elearning/ElearningSingleNew';
import Whatson from './Frontend/Whatson/Whatson';
import WhatsonSingle from './Frontend/WhatsonSingle';
import Classified from './Frontend/Classified/ClassifiedList';
import ClassifiedSingle from './Frontend/Classified/ClassifiedSingle';
import TopicList from './Frontend/Topics/TopicsList';
import StandaloneMap from './Frontend/components/Map/Map';
import MapContainer from './Frontend/components/Map/MapContainer';

/** Dashboard */
import Dashboard from "./Dashboard/Dashboard";

import ProfileSettings from './Dashboard/Settings/Profile';
import OrganizationContact from './Dashboard/Organization/Contact';
import StaffSettings from './Dashboard/Organization/Staff';
import OrganizationProfile from './Dashboard/Organization/Profile';
import AllMembers from './Dashboard/Members/MemberList';
import MemberRequest from './Dashboard/Members/MemberRequest';

import ProjectList from './Dashboard/Projects/ProjectList';
import AddNewProject from './Dashboard/Projects/AddNewProject';
import EditProject from './Dashboard/Projects/EditProject';

import ElearningList from './Dashboard/Elearning/ElearningList';
import AddNewElearning from './Dashboard/Elearning/AddNewElearning';
import EditElearning from './Dashboard/Elearning/EditElearning';

import DataHubList from './Dashboard/DataHub/DataHubList';
import AddDataHub from './Dashboard/DataHub/AddDataHub';
import EditDataHub from './Dashboard/DataHub/EditDataHub';

import WhatsonList from "./Dashboard/Whatson/WhatsonList";
import AddNewWhatson from "./Dashboard/Whatson/AddNewWhatson";
import EditWhatson from "./Dashboard/Whatson/EditWhatson";

import ClassifiedList from './Dashboard/Classifieds/ClassifiedList';
import AddNewClassified from './Dashboard/Classifieds/AddNewClassified';
import EditClassified from './Dashboard/Classifieds/EditClassified';

import MediaLibrary from './Dashboard/MediaLibrary/MediaLibrary';


/** SuperUser */
import SupDashboard from "./Superuser/Dashboard";
import SupUsers from "./Superuser/Users/Users";
import NewRequest from "./Superuser/Users/NewRequest";

import CMSPages from "./Superuser/Pages/Pages";
import EditHomePage from "./Superuser/Pages/UpdateHome";
import EditAboutPage from "./Superuser/Pages/UpdateAbout";

import MembersList from "./Superuser/Members/MembersList";
import AddNewMember from "./Superuser/Members/AddNewMember";
import EditMember from "./Superuser/Members/EditMember";

import Tags from "./Superuser/Tags/Tags";
import OtherTags from "./Superuser/Tags/OtherTags";
import AddL1Tags from "./Superuser/Tags/AddL1Tags";
import AddL2Tags from "./Superuser/Tags/AddL2Tags";
import AddL3Tags from "./Superuser/Tags/AddL3Tags";
import Analytics from "./Superuser/Analytics/Analytics"
import Organizations from "./Superuser/Organizations/Organizations";
import ActiveOrgs from './Superuser/Organizations/ActiveOrgs';
import InactiveOrgs from './Superuser/Organizations/InactiveOrgs';
import ProjectsAdmin from "./Superuser/Projects/Projects";
import DataSets from "./Superuser/DataSets/DataSets";

import Datatable from "./Superuser/Datatable";

/**
 * Kaveesh
 */
import WhatsOnEventsNew from "./Frontend/Whatson/WhatsOnEventsNew";
import ResourcePoolNew from './Frontend/ResourceExchange/ResourcePoolNew';
import ResourceJobsNew from './Frontend/ResourceExchange/ResourceJobsNew';
import ResourcesRFPNew from './Frontend/ResourceExchange/ResourcesRFPNew';
import ResourceSuppliersNew from './Frontend/ResourceExchange/ResourceSuppliersNew';

import SupplierProfileNew from './Frontend/ResourceExchange/SupplierProfileNew';
import GrantsAndProposalProfileNew from './Frontend/ResourceExchange/GrantsAndProposalProfileNew';
import ResourceSharingProfileNew from './Frontend/ResourceExchange/ResourceSharingProfileNew';
import WhatsOnVolunteerNew from "./Frontend/Whatson/WhatsOnVolunteerNew";
import WhatsOnMediaAdvocacyNew from "./Frontend/Whatson/WhatsOnMediaAdvocacyNew";
import WhatsOnEventProfileNew from "./Frontend/Whatson/WhatsOnEventProfileNew";
import VoluneteerOppurtunityNew from './Frontend/Whatson/VoluneteerOppurtunityNew';
import WhatsonMediaAndAdvocacyProfileNew from './Frontend/Whatson/WhatsonMediaAndAdvocacyProfileNew';


import RegisterThankYou from './Frontend/Pages/RegisterThankYou';
import Support from './Frontend/Pages/Support';
import ContactUs from './Frontend/Pages/ContactUs';
import Privacy from './Frontend/Pages/Privacy';
import Copyright from './Frontend/Pages/Copyright';
import Terms from './Frontend/Pages/Terms';
import FAQ from './Frontend/Pages/FAQ';
import Code from './Frontend/Pages/Code';
import SingleUser from './Superuser/Users/SingleUser';
import SingleUserForm from './Superuser/Users/SingleUserForm';

import OrgReg from './Frontend/Auth/OrgReg';
import ForgotPassword from './Frontend/Auth/ForgotPassword';
import ResetPassword from './Frontend/Auth/ResetPassword';
import NewProjectList from './Frontend/Projects/NewProjectList';
import NewDataHub from './Frontend/DataHub/NewDataHub';
import ResourcePage from './Frontend/ResourceExchange/ResourcePage';
import OrgWhatsOn from './Frontend/components/OrgWhatsOn';
import OrgELearning from './Frontend/components/OrgELearning';

import Subscriptions from './Dashboard/Settings/Subscriptions';
import JobProfileNew from '../components/Frontend/ResourceExchange/JobProfileNew';

// Temp imports Remove on production
import NewLogin from './Frontend/Auth/NewLogin';

import ProjectsByOrg from '../components/Frontend/components/ProjectsByOrg';
import DataHubSingleNew from '../components/Frontend/DataHub/DataHubSingleNew';

import OrgContactDetails from '../components/Frontend/components/OrgContactDetails';
import CarousalContainer from '../components/Frontend/components/CarousalContainer';
import NotFound from '../components/Dashboard/NotFound';

/** Axios configuration  */
axios.defaults.baseURL = baseUrl;
axios.defaults.headers.post['Content-Type'] = "application/json";
axios.defaults.headers.post['Accept'] = "application/json";
axios.defaults.withCredentials = true;

axios.interceptors.request.use(function(config) {
    const token = localStorage.getItem('auth_token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
});

const theme = createTheme({
    typography: {
        fontFamily: "Manrope",
        fontWeightLight: 400,
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <ScrollToTop />
                <Routes>
                    {/* =================== General Routes =================== */}

                    <Route exact path={"/"} element={<HomeNew />} />
                    <Route exact path={"/404"} element={<NotFound />} />
                    <Route path={"/about"} element={<NewAboutPage />} />
                    <Route path={"/about-feo"} element={<NewAboutPage />} />
                    <Route path={"/org-directory"} element={<OrganizationDirectory />} />
                    <Route path={"/register-as"} element={<OrgReg />} />
                    <Route path={"/organizations"} element={<OrganizationListNew />} />
                    <Route path={"/organization/:slug"} element={<SingleOrganization />} />
                    <Route path={"/:slug/resources"} element={<OrganizationResources />} />
                    <Route path={"/:slug/datasets"} element={<OrganizationDatasets />} />
                    <Route path={"/:slug/classified"} element={<OrganizationClassified />} />

                    <Route path={"/projects"} element={<NewProjectList />} />
                    <Route path={"/project-map"} element={<ProjectMap />} />
                    <Route path={"/project/:slug"} element={<SinglePostNew />} />

                    <Route path={"/elearning-materials"} element={<ElearningListNew />} />
                    <Route path={"elearning-material/:slug"} element={<ElearningSingleNew />} />
                    

                    <Route path={"/datahub"} element={<NewDataHub />} />
                    <Route path={"datahub/:slug"} element={<DataHubSingleNew />} />
                    <Route path={"/datahub-single/:slug"} element={<DataHubSingleNew />} />

                    <Route path={"/whatson"} element={<Whatson />} />
                    <Route path={"/whatson/:slug"} element={<WhatsonSingle />} />
                    <Route path={"/whatson/events"} element={<WhatsOnEventsNew />} />
                    <Route path={"/whatson/volunteer-opportunities"} element={<WhatsOnVolunteerNew />} />
                    
                    <Route path={"/whatson/media-and-advocacy"} element={<WhatsOnMediaAdvocacyNew />} />

                    <Route path={"/whatson-event/:slug"} element={<WhatsOnEventProfileNew />} />
                    
                    <Route path={"/whatson-volunteer-opportunity/:slug"} element={<VoluneteerOppurtunityNew />} />
                    
                    <Route path={"/whatson-media-and-advocacy/:slug"} element={<WhatsonMediaAndAdvocacyProfileNew />} />
                    

                    <Route path={"/classified"} element={<Classified />} />
                    <Route path={"classified/:slug"} element={<ClassifiedSingle />} />

                    <Route path={"topics"} element={<TopicList />} />
                    <Route path={"/stmap"} element={<MapContainer />} />
                    <Route path={"/mapd"} element={<Map />} />
                    <Route path={"/map"} element={<FullMap />} />

                    <Route path={"resource-exchange"} element={<ResourcePage />} />
                    <Route path={"resource-exchange/jobs"} element={<ResourceJobsNew />} />
                    <Route path={"resource-exchange/suppliers"} element={<ResourceSuppliersNew />} />
                    <Route path={"resource-exchange/grants-and-proposals"} element={<ResourcesRFPNew />} />
                    <Route path={"resource-exchange/resource-sharing"} element={<ResourcePoolNew />} />

                    <Route path={"resource-exchange-job/:slug"} element={<JobProfileNew />} />
                    <Route path={"resource-exchange-supplier/:slug"} element={<SupplierProfileNew />} />
                    <Route path={"resource-exchange-proposal/:slug"} element={<GrantsAndProposalProfileNew />} />
                    
                    <Route path={"resource-exchange-resource-sharing/:slug"} element={<ResourceSharingProfileNew />} />
                    

                    {/* =================== USER Routes =================== */}
                    <Route path={"/dashboard"} element={<Protected component={Dashboard} />} />
                    <Route path={"/subscriptions"} element={<Protected component={Subscriptions} />} />

                    <Route path={"/profile"} element={<Protected component={OrganizationProfile} />} />
                    <Route path={"/profile-contact"} element={<Protected component={OrganizationContact} />} />
                    <Route path={"/profile-staff"} element={<Protected component={StaffSettings} />} />

                    <Route path={"/project-list"} element={<Protected component={ProjectList} />} />
                    <Route path={"/add-project"} element={<Protected component={AddNewProject} />} />
                    <Route path={"/edit-project/:slug"} element={<Protected component={EditProject} />} />

                    <Route path={"/elearning-list"} element={<Protected component={ElearningList} />} />
                    <Route path={"/add-elearning"} element={<Protected component={AddNewElearning} />} />
                    <Route path={"/edit-elearning/:slug"} element={<Protected component={EditElearning} />} />

                    <Route path={"/datahub-list"} element={<Protected component={DataHubList} />} />
                    <Route path={"/add-datahub"} element={<Protected component={AddDataHub} />} />
                    <Route path={"/edit-datahub/:slug"} element={<Protected component={EditDataHub} />} />

                    <Route path={"/whatson-list"} element={<Protected component={WhatsonList} />} />
                    <Route path={"/add-whatson"} element={<Protected component={AddNewWhatson} />} />
                    <Route path={"/edit-whatson/:slug"} element={<Protected component={EditWhatson} />} />

                    <Route path={"/classified-list"} element={<Protected component={ClassifiedList} />} />
                    <Route path={"/add-classified"} element={<Protected component={AddNewClassified} />} />
                    <Route path={"/edit-classified/:slug"} element={<Protected component={EditClassified} />} />

                    <Route path={"/media-library"} element={<Protected component={MediaLibrary} />} />

                    <Route path={"/all-members"} element={<Protected component={AllMembers} />} />
                    <Route path={"/member-request"} element={<Protected component={MemberRequest} />} />

                    <Route path={"/profile-settings"} element={<Protected component={ProfileSettings} />} />


                    {/* =================== SuperUser Routes =================== */}
                    <Route path={"/admin/dashboard"} element={<SuperUserRoute component={SupDashboard} />} />
                    <Route path={"/admin/users"} element={<SuperUserRoute component={SupUsers} />} />
                    <Route path={"/admin/single-user"} element={<SuperUserRoute component={SingleUser} />} />
                    <Route path={"/admin/new-request"} element={<SuperUserRoute component={NewRequest} />} />
                    <Route path={"/admin/pages"} element={<SuperUserRoute component={CMSPages} />} />
                    <Route path={"/edit-page/1"} element={<SuperUserRoute component={EditHomePage} />} />
                    <Route path={"/edit-page/2"} element={<SuperUserRoute component={EditAboutPage} />} />
                    <Route path={"/admin/members-list"} element={<SuperUserRoute component={MembersList} />} />
                    <Route path={"/admin/add-new-member"} element={<SuperUserRoute component={AddNewMember} />} />
                    <Route path={"/edit-member/:slug"} element={<SuperUserRoute component={EditMember} />} />
                    <Route path={"/edit-user/:id"} element={<SuperUserRoute component={SingleUserForm} />} />

                    <Route path={"/admin/tags"} element={<SuperUserRoute component={Tags} />} />
                    <Route path={"/admin/other-tags"} element={<SuperUserRoute component={OtherTags} />} />
                    <Route path={"/admin/addl1"} element={<SuperUserRoute component={AddL1Tags} />} />
                    <Route path={"/admin/addl2"} element={<SuperUserRoute component={AddL2Tags} />} />
                    <Route path={"/admin/addl3"} element={<SuperUserRoute component={AddL3Tags} />} />
                    
                    
                    <Route path={"/admin/analytics"} element={<SuperUserRoute component={Analytics} />} />
                    <Route path={"/admin/organizations"} element={<SuperUserRoute component={ActiveOrgs} />} />
                    <Route path={"/admin/organizations-disabled"} element={<SuperUserRoute component={InactiveOrgs} />} />
                    <Route path={"/admin/projects"} element={<SuperUserRoute component={ProjectsAdmin} />} />
                    <Route path={"/admin/data-sets"} element={<SuperUserRoute component={DataSets} />} />
                    
                    {/* =================== ENC001 =================== */}

                    {/* General Routes */}
                    <Route exact path={"/thank-you"} element={<RegisterThankYou />} />
                    <Route exact path={"/get-support"} element={<Support />} />
                    <Route exact path={"/contact"} element={<Support />} />
                    <Route exact path={"/privacy"} element={<Privacy />} />
                    <Route exact path={"/copyright"} element={<Copyright />} />
                    <Route exact path={"/terms"} element={<Terms />} />
                    <Route exact path={"/faq"} element={<FAQ />} />
                    <Route exact path={"/code-of-conduct"} element={<Code />} />
                    {/* Super admin routes */}
                    <Route path={"/en-admin/dashboard"} element={<Datatable />} />
                    {/* =================== ENC001 =================== */}
                    
                    <Route path={"/forgot-password"} element={<ForgotPassword />} />
                    <Route path={"/reset-password"} element={<ResetPassword />} />
                    <Route path={"/login"} element={<NewLogin />} />
                    <Route path={"/single-proj/:slug"} element={<SinglePostNew />} />
                    <Route path={"/single-org/:slug"} element={<SingleOrganization />} />
                    <Route path={"/projbyorg"} element={<ProjectsByOrg />} />
                    <Route path={"/condt"} element={<OrgContactDetails />} />
                    <Route path={"/carousal"} element={<CarousalContainer />} />
                    <Route path={"/org-e-learn"} element={<OrgELearning />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;

if (document.getElementById("app")) {
    ReactDOM.render(<App />, document.getElementById("app"));
}
