import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Container,
    Grid,
    Typography,
    Stack,
    CardActions,
    CardContent,
    CardMedia,
    menuIcon,
    Box,
    TextField,
    InputAdornment,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Divider
} from "@mui/material";
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import SettingsApplicationsOutlinedIcon from '@mui/icons-material/SettingsApplicationsOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import BaseLayout from "../BaseLayout";
// import TopicMenu from "./TopicMenu";
import SearchIcon from '@mui/icons-material/Search';
import PlaceIcon from '@mui/icons-material/Place';
import ListIcon from '@mui/icons-material/List';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import ListSkeleton8 from '../components/ListSkeleton8';
import Chip from '@mui/material/Chip';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import AddButton from '../components/AddButton';
import OrgLink from '../components/OrgLink';
import Skeleton from '@mui/material/Skeleton';
import ClusteredMap from '../ResourceExchange/ClusteredMap';
import moment from 'moment';
import LexicalEditorView from "../Elearning/LexicalEditorView";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import ExampleTheme from "../../Dashboard/LexicalEditor/themes/ExampleTheme";
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import RenderHTML from '../components/RenderHTML';

function ResourceSharingProfileNew(props) {

    const postParams = useParams();

    const [title, setTitle] = useState('Data Submission Title');
    const [description, setDescription] = useState({
        overview: '',
        description: '',
        author: '',
        location: ''
    });
    const [location, setLocation] = useState({
        name_en: "",
        name_si: "",
        name_ta: "",
    })
    const [relatedContent, setRelatedContent] = useState([]);
    const [editorInitialConfig, setEditorInitialConfig] = useState([]);
    const [images, setImages] = useState([]);
    const [organization, setOrganization] = useState({
        title: 'Test',
        url: '/product/test',
        type: 'type',
        initial: 'M',
        name: 'Encyte'
    })
    const [tags, setTags] = useState([]);
    const [misc, setMisc] = useState({
        addedDate: '',
        dateString: ''
    })

    const [files, setFiles] = useState([]);
    // weblinks 
    const [webLinks, setWebLinks] = useState([]);

    const [markers, setMarkers] = useState([
        { lat: 6.868541278372921, lng: 80.40345948463631, text: 'Marker 1', open: false },
    ]);
    const [mapConfigs, setMapConfigs] = useState({
        center: { lat: 7.491214239209488, lng: 80.71736087951162 },
        zoom: 9,
        open: false,
    })

    //loaders
    const [loaders, setLoaders] = useState({
        title: true,
        organization: true,
        tags: true,
        locations: true,
        relatedContent: true,
    })

    const orgTypes = [
        'None',
        'CSO/NGO',
        'Academia',
        'Research Institution',
        'Private sector',
        'Media',
        'Donor'
    ];

    useEffect(() => {
        setLoaders({
            title: true,
            organization: true,
            tags: true,
            locations: true,
            relatedContent: true,
        })
        stopLoaders();
        getProjectProfile();
        if (description.description) {
            editorConfig.editorState = description.description;
            setEditorInitialConfig(editorConfig);
        }
    }, [postParams.slug, localStorage.getItem('auth_id'), description.description]);


    // API Calls
    const getProjectProfile = () => {
        axios.get(`/api/resource-exchange-resource/${postParams.slug}`).then(res => {
            if (res.data.status === 200) {
                console.log(res.data);

                setTitle(res.data.profile.title);
                setDescription({
                    overview: res.data.profile.overview,
                    description: res.data.profile.description,
                });
                setLocation({
                    name_en: res.data.district.name_en,
                    name_si: res.data.district.name_si,
                    name_ta: res.data.district.name_ta,
                })

                // // set images
                setImages(JSON.parse(res.data.profile.uploads));
                console.log(JSON.parse(res.data.profile.uploads));

                // set files
                setFiles(JSON.parse(res.data.profile.photos));

                // // get project tags
                // // getProjectTags({ id: res.data.get_data.id });

                // // set other data
                const addedDateString = res.data.profile.created_at;
                const addedFormated = moment(addedDateString).format("YYYY/M/D");
                setMisc({
                    addedDate: addedFormated,
                    dateString: res.data.profile.created_at
                });

                // set organization details
                let name = Array.from(res.data.organization.org_name)[0];
                setOrganization({
                    initial: name.toUpperCase(),
                    url: '/organization/' + res.data.organization.slug,
                    type: orgTypes[res.data.organization.org_type],
                    name: res.data.organization.org_name,
                })

                setWebLinks(JSON.parse(res.data.profile.weblink));

                // // Load related projects;
                // getRelatedProjects({"skip": 0,"take": 10,"type": 1});

            }
            else if (res.data.status === 404) {
                console.log(res.message);
            }
        });
    }

    const getProjectTags = (data) => {
        axios.post(`/api/get-project-tags`, data).then(res => {
            if (res.data.status === 200) {
                setTags(res.data.tags)
                console.log(res.data.tags);
            }
            else if (res.data.status === 404) {
                console.log(res.message);
            }
        });
    }

    //TODO:- Update the related project query logic and change this API;
    const getRelatedProjects = (data) => {
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post('/api/get-e-learing-data', data).then(res => {
                console.log(res)
                if (res.status == 200) {
                    setRelatedContent(res.data.projects);
                } else {
                    // handle the error
                }
            });
        });
    }

    const stopLoaders = () => {
        setTimeout(() => {
            setLoaders({
                title: false,
                organization: false,
                tags: false,
                locations: false,
            });
        }, 2000);
    }

    let editorConfig = {
        theme: ExampleTheme,
        onError(error) {
            throw error;
        },
        nodes: [
            HeadingNode,
            ListNode,
            ListItemNode,
            QuoteNode,
            CodeNode,
            CodeHighlightNode,
            TableNode,
            TableCellNode,
            TableRowNode,
            AutoLinkNode,
            LinkNode
        ],
        editable: false,
    };

    const handleImageError = (event) => {
        event.target.src = '../../../images/project-default.jpg'; // Set the fallback image URL
    };

    const handleImageErrorData = (event) => {
        event.target.src = '../../../images/data-default.jpg'; // Set the fallback image URL
    };

    return (
        <BaseLayout title={"Topic"}>
            <div className="single-post-title-section">

                {/* Begin Header */}
                <Container>
                    <Grid container>
                        <Grid item sm={12} md={6} lg={6} mt={3}>
                            <Link style={{
                                color: '#8ea93c'
                            }} to={`/resource-exchange/jobs/`}>
                                <Typography sx={{ fontSize: '12px' }}>{`Resource Exchange > Resource Pool`}</Typography>
                            </Link>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item sm={12} md={6} lg={6}>
                            {loaders.title ? (
                                <div>
                                    <Skeleton variant="text" sx={{ fontSize: '32px' }} />
                                    <Skeleton variant="text" width={'60%'} sx={{ fontSize: '32px' }} />
                                </div>
                            ) : (
                                <Typography variant="h1" sx={{ fontWeight: '500' }}>{title}</Typography>
                            )}
                        </Grid>
                        <Grid item sm={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <AddButton
                                title="Do you work on environmental issues in Sri Lanka"
                                link="/add-classified"
                                linkLabel="Post a Job" />
                        </Grid>
                    </Grid>
                    <Grid container>
                        {loaders.organization ? (
                            <Grid item sm={12} md={6} lg={8}>
                                <Skeleton variant="circular" width={40} height={40} />
                            </Grid>
                        ) : (
                            <Grid item sm={12} md={6} lg={8}>
                                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', display: 'flex' }}>
                                    <OrgLink initial={organization.initial} name={organization.name} visited link={organization.url} />
                                    <Typography sx={{ fontSize: '16px', borderLeft: 'solid 1px #777', paddingLeft: '16px' }}>{location.name_en}</Typography>
                                    <Typography sx={{ fontSize: '16px', borderLeft: 'solid 1px #777', paddingLeft: '16px' }}>{moment(misc.dateString).fromNow()}</Typography>
                                </Stack>
                            </Grid>
                        )}
                    </Grid>
                </Container>
                {/* End Header */}

                {/* Overview */}
                <Container>
                    <Grid className="text-container" container mt={4}>
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>Overview</Typography>
                        </Grid>
                        {loaders.title ? (
                            <Grid item xs={12}>
                                <Skeleton variant="text" sx={{ fontSize: '32px' }} />
                            </Grid>
                        ) : (
                            <Grid item xs={12}>
                                <Typography sx={{ fontSize: '16px', fontWeight: '400' }}>{description.overview}</Typography>
                            </Grid>
                        )}
                    </Grid>
                </Container>
                {/* End Overview */}

                {/* Main Image */}
                <Container>
                    <Grid className="text-container" container mt={4}>
                        <Grid item xs>
                            {images.length > 0 ? (
                                <CardMedia
                                    component="img"
                                    height="400"
                                    image={`/storage/` + images[0]}
                                    alt="Project Image"
                                    loading="lazy"
                                />
                            ) : (
                                <CardMedia
                                    component="img"
                                    height="400"
                                    image={`../../../images/project-default.jpg`}
                                    alt="Project Image"
                                    loading="lazy"
                                />
                            )}

                        </Grid>
                    </Grid>
                </Container>
                {/* End Main Image */}

                {/* Description */}
                <Container>
                    <Grid className="text-container" container mt={4}>
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>Description</Typography>
                        </Grid>
                        {loaders.title ? (
                            <Grid item xs={12}>
                                <Skeleton variant="text" sx={{ fontSize: '32px' }} />
                                <Skeleton variant="text" sx={{ fontSize: '32px' }} />
                                <Skeleton variant="text" sx={{ fontSize: '32px' }} />
                                <Skeleton variant="text" sx={{ fontSize: '32px' }} />
                                <Skeleton variant="text" width={'60%'} sx={{ fontSize: '32px' }} />
                            </Grid>
                        ) : (
                            <Grid item xs={12}>
                                {/* {editorInitialConfig.length !== 0 && <LexicalEditorView initialConfig={editorInitialConfig} />} */}
                                <RenderHTML data={description.description} />
                            </Grid>
                        )}
                        {!loaders.title ? (
                            <Grid item xs={12}>
                                {description.link ? '' : ''}
                            </Grid>
                        ) : ('')}
                    </Grid>
                </Container>
                {/* End Description */}

                {/* Date */}
                <Container>
                    <Grid className="text-container" container mt={4}>
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>Added Date</Typography>
                        </Grid>
                        {loaders.title ? (
                            <Grid item xs={12}>
                                <Skeleton variant="text" sx={{ fontSize: '32px' }} />
                            </Grid>
                        ) : (
                            <Grid item xs={12}>
                                <Typography sx={{ fontSize: '16px', fontWeight: '400' }}>{misc.addedDate}</Typography>
                            </Grid>
                        )}
                    </Grid>
                </Container>
                {/* End Date */}

                {/* Files */}
                <Container>
                    <Grid className="text-container" container mt={4}>
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>Files</Typography>
                        </Grid>
                        {loaders.title ? (
                            <Grid item xs={12}>
                                <Skeleton variant="text" sx={{ fontSize: '32px' }} />
                            </Grid>
                        ) : (
                            <Grid item mt={2} sm={12} md={12} lg={12} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                {files.map((file) => (
                                    <a href={`/storage/${file}`} style={{ display: 'flex', color: '#8ea93c', marginBottom: '16px' }}>
                                        <InsertDriveFileIcon style={{ color: '#8ea93c' }} />
                                        <Typography sx={{ fontSize: '14px', color: '#8ea93c' }} ml={0} mr={1}>{file}</Typography>
                                    </a>
                                ))}
                            </Grid>
                        )}
                    </Grid>
                </Container>
                {/* End Date */}

                {/* Related Content */}
                <Container>
                    <Grid container mt={4} mb={2}>
                        <Grid item xs={12}>
                            <Typography sx={{ fontSize: '16px', fontWeight: '600' }} >Similar Submissions</Typography>
                        </Grid>
                    </Grid>
                </Container>
                {/* End Related Content */}
            </div>

            <Container style={{ marginBottom: '24px' }}>
                {loaders.relatedContent ? <ListSkeleton8 /> :
                    <Grid container spacing={2}>
                        {relatedContent.map((project, key) => (
                            <Grid item key={key} xs={3} className="organization_card" >
                                <Link style={{
                                    height: "100%",
                                    display: 'block',
                                    border: '1px solid #ececec',
                                    borderRadius: '10px'
                                }} to={`/datahub/` + project.slug}>
                                    {project.photos.length !== 0 ?
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={`/storage/` + JSON.parse(project.photos)[0]}
                                            onError={handleImageError}
                                            alt="green iguana"
                                            loading="lazy"
                                        />
                                        :
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image="../../../images/project.jpg"
                                            alt="green iguana"
                                            loading="lazy"
                                        />
                                    }
                                    <CardContent className="card_content project-card">
                                        {/* <Typography variant="span" className="main-tag">{project.tags[0].name}</Typography> */}
                                        <Typography variant="h6" className="card-title">{project.title}</Typography>
                                        <Typography variant="subtitle" className="card-body">
                                            {project.overview !== null ? project.overview.substring(0, 50) : ''}
                                        </Typography>
                                        <ul className="related-tags">

                                            {project.tags.length !== 0 ?
                                                <li><Link to=''>
                                                    <Chip sx={{ marginTop: '5px', backgroundColor: '#edf7c9' }} label={project.tags[0].name.substring(0, 20)} />
                                                </Link></li>
                                                : ''}
                                        </ul>
                                    </CardContent>
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                }
                {
                    relatedContent.length == 0 ?
                        !loaders.relatedContent ? <Grid container>
                            <Grid item sm={12} md={6}>
                                <Typography sx={{ fontSize: '12px' }} mt={3}>No projects found for selected filters</Typography>
                            </Grid>
                        </Grid> : ''
                        : ''
                }
            </Container>
        </BaseLayout>
    )
}

export default ResourceSharingProfileNew
