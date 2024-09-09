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

function DeleteUserActionItem({ deleteUser, ...props }) {
    const [open, setOpen] = React.useState(false);
  
    return (
      <React.Fragment>
        <GridActionsCellItem {...props} onClick={() => setOpen(true)} />
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Delete this user?</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                setOpen(false);
                deleteUser();
              }}
              color="warning"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }


function Organizations() {

    

    useEffect(() => {
      }, [selectedOption]); // Dependency array makes sure effect runs only when selectedOption changes
      

    const columns = [
        {
            field: 'anchor', headerName: 'Organization', flex: 'grow',
            renderCell: (params) => (
                <a href={`/organization/${params.value.slug}`}>{params.value.organization}</a>
            ),
        },
        { field: 'type', headerName: 'Type', flex: 1 },
        { field: 'reg', headerName: 'Registration', flex: 1 },
        { field: 'size', headerName: 'Size', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'phone', headerName: 'Phone', flex: 1 },
        { field: 'joined', headerName: 'Joined', flex: 1 },
        {
            field: 'actions', headerName: 'Actions', flex: 1,
            renderCell: (params) => {
                return (
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <div className="action-button-div">
                            <IconButton
                                aria-controls="select-menu"
                                aria-haspopup="true"
                                onClick={(event) => handleOpenMenu(event, params.value)}
                                color="primary"
                            >
                                <MoreVertIcon sx={{ color: '#85a129' }} />
                            </IconButton>
                            <Menu
                                id="select-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleCloseMenu}
                            >
                                <MenuItem onClick={() => handleOptionSelect(params.id)}>
                                    <ListItemIcon>
                                        <EditIcon />
                                    </ListItemIcon>
                                    Disable {params.id}
                                </MenuItem>
                                {/* <MenuItem onClick={() => handleOptionSelect('Option 2')}>
                                    <ListItemIcon>
                                        <DeleteIcon />
                                    </ListItemIcon>
                                    Remove
                                </MenuItem> */}
                            </Menu>
                        </div>
                    </div>
                );
            }
        },
    ];

    const [rows, setRows] = useState([
        { id: 1, anchor: '', organization: 'Organization1', type: 'Academia', reg: '123456789', size: '11 - 30', email: 'organization@feo.lk', phone: '0112938475', joined: '2023-02-23 07:33:22', actions: '' },
        { id: 2, anchor: '', organization: 'Organization2', type: 'Academia', reg: '123456789', size: '11 - 30', email: 'organization@feo.lk', phone: '0112938475', joined: '2023-02-23 07:33:22', actions: '' },
    ])
    const [Loading, setLoading] = useState([true]);
    const [orgTypeList, setOrgTypeList] = useState([]);

    const [selectedOption, setSelectedOption] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const disableProfile = () => {
        setOpen(false);
        console.log(selectedOption);
        // disableOrganiation({
        //     'organization_id': selectedOption
        // })
    }

    const disableOrganiation = (data) => {
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post('/api/disable-organization', data).then(res => {
                console.log(res);
                if (res.status == 200) {
                    setLoading(false);
                    console.log(res.data);
                    getAllOrganizations();
                }
            });
        })
    }

    useEffect(() => {
        getOrganizationTypes();
    }, []);

    //Retrieve organization types
    const getOrganizationTypes = () => {
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.get('/api/organisation-types').then(res => {
                if (res.data.status === 200) {
                    setOrgTypeList(res.data.organizationTypes);
                    // once the organization types are loaded, load the org list
                    getAllOrganizations();
                }
            });
        });
    }

    const getAllOrganizations = () => {
        axios.post('/api/get-org-list').then(res => {
            if (res.status == 200) {
                setLoading(false);
                console.log(res.data);
                let users = res.data.organizations.map((user) => {
                    return {
                        id: user.id,
                        organization: user.org_name,
                        type: orgTypeList[user.org_type],
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

    // const handleOpenMenu = (event) => {
    //     setAnchorEl(event.currentTarget);
    // };

    const handleOpenMenu = (event, params) => {
        setAnchorEl(event.currentTarget);
        // Optionally store params or other necessary data if required for actions
    };
    

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleOptionSelect = (option) => {
        console.log(option);
        setSelectedOption(option);
        handleCloseMenu();
        handleClickOpen();
    };

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

export default Organizations;