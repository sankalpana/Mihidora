import React, { useState, useEffect } from "react";
import { IconButton, Menu, MenuItem, Select, FormControl, InputLabel, ListItemIcon, TextField } from "@mui/material";
import MainLayout from "../BaseLayout";
import axios from 'axios';
import swal from 'sweetalert';
import { DataGrid, GridColDef, GridValueGetterParams, GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function ActiveOrgs() {

    const [Loading, setLoading] = useState([true]);
    const [orgTypeList, setOrgTypeList] = useState([]);
    const [rows, setRows] = useState([]);

    // const types = {
    //     "1": "CSO/NGO",
    //     "2": "Academia",
    //     "3": "Research Institution",
    //     "4": "Private sector",
    //     "5": "Media",
    //     "6": "Donor / Development Partner",
    //     "7": "University Clubs",
    //     "8": "IGO",
    //     "9": "Bilateral Organizations",
    //     "10": "INGO"
    // }
    const types = {
        "1": "CSO/NGO",
        "2": "Clubs - School or Tertiary",
        "3": "Research Organisation - nonprofit",
        "4": "Private sector",
        "5": "Media",
        "6": "Donor / Development Parnter",
        "7": "University Clubs",
        "8": "IGO",
        "9": "Bilateral Organizations",
        "10": "International NGO (INGO)",
        "11": "Research Organisation - private",
        "12": "Private Institution",
        "13": "Intergovernmental Organisation (IGO)",
        "14": "Other",
    }

    useEffect(() => {
        console.log('Active Orgs');
        getOrganizationTypes();
    }, []);

    // data tables
    const columns = [
        {
            field: 'anchor', headerName: 'Name', flex: 1,
            renderCell: (params) => (
                <a href={`/organization/${params.value.slug}`}>{params.value.organization}</a>
            ),
        },
        { field: 'type', headerName: 'Type', flex: 1 },
        { field: 'size', headerName: 'Size', flex: 1 },
        { field: 'reg', headerName: 'Registraion', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'phone', headerName: 'Phone', flex: 1 },
        { field: 'joined', headerName: 'Joined', flex: 1 },
        {
            field: 'actions', headerName: '', flex: 1,
            renderCell: (params) => {
                return <Button value={params.value.org_id} className="update-button" onClick={(e) => disableOrg(e)}>Disable</Button>;
            }
        },
    ];

    const [selected, setSelected] = useState('');

    const disableOrg = (e) => {
        e.preventDefault();
        console.log("Disable organization");
        setSelected(e.target.value);
        setOpen(true);
        console.log(e.target.value);
    }

    // disable confirmation dialog.
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const disableProfile = () => {
        console.log('Yes Disable!');
        disableOrganiation({
            'organization_id': selected
        });
    }

    //API Calls
    //disable org
    const disableOrganiation = (data) => {
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post('/api/disable-organization', data).then(res => {
                console.log(res);
                if (res.status == 200) {
                    console.log(res.data);
                    setOpen(false);
                    getAllOrganizations();
                }
            });
        })
    }

    //Retrieve organization types
    const getOrganizationTypes = () => {
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.get('/api/organisation-types').then(res => {
                if (res.data.status === 200) {
                    let types = Object.fromEntries(res.data.organizationTypes.map(item => [item.id, item.type]));
                    console.log(types);
                    setOrgTypeList(types);
                    // once the organization types are loaded, load the org list
                    getAllOrganizations();
                }
            });
        });
    }

    const getAllOrganizations = () => {
        setLoading(true);
        axios.post('/api/get-org-list').then(res => {
            if (res.status == 200) {
                setLoading(false);
                console.log(res.data);
                let users = res.data.organizations.map((user) => {
                    return {
                        id: user.id,
                        organization: user.org_name,
                        type: types[user.org_type],
                        reg: user.reg_number,
                        // contact: user.name,
                        description: user.description,
                        links: user.links,
                        track_record: user.track_record,
                        email: user.email,
                        phone: user.contact_number,
                        joined: user.created_at,
                        user_id: user.user_id,
                        size: user.org_size,
                        anchor: { slug: user.slug, organization: user.org_name },
                        actions: { org_id: user.id }
                    };
                });
                setRows(users);
            }
        });
    }


    return (
        <MainLayout>
            <DataGrid
                rows={rows}
                slots={{ toolbar: GridToolbar }}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                sx={{
                    '& .MuiDataGrid-virtualScroller': {
                        minHeight: '300px'
                    }
                }}
                loading={Loading}
                pageSizeOptions={[5, 10, 20, { value: rows.length > 0 ? rows.length : 1, label: 'All' }]}
            />

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Are you sure you want to disable this profile?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        By confirming this action, the system will take the profile offline along with all the content contributed by the organization.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>NO</Button>
                    <Button onClick={disableProfile} autoFocus>
                        YES DISABLE
                    </Button>
                </DialogActions>
            </Dialog>

        </MainLayout>
    )
}

export default ActiveOrgs;