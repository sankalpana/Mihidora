import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import MainLayout from "../BaseLayout";
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams, GridToolbar } from '@mui/x-data-grid';

const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'type', headerName: 'Type', flex: 1 },
    { field: 'joined', headerName: 'Joined', flex: 1 },
];

function Datatable() {

    const [UserList, setUserList] = useState([
        { id: 1, name: '', email: '', type: '', organization: '', joined: '' },
        { id: 2, name: '', email: '', type: '', organization: '', joined: '' },
        { id: 3, name: '', email: '', type: '', organization: '', joined: '' },
    ]);
    const [Loading, setLoading] = useState([true]);

    const userTypes = [
        'Admin',
        'Individual',
        'Organization'
    ]

    useEffect(() => {
        getAllUsers();
    }, []);

    const getAllUsers = () => {
        axios.get('/api/view-users').then(res => {
            if (res.status == 200) {
                setLoading(false);
                console.log(res.data);
                let users = res.data.users.map((user) => {
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        type: userTypes[user.user_role],
                        organization: user.org_name,
                        joined: user.created_at
                    };
                });
                setUserList(users);

            }
        });
    }

    return (
        <Box>
            <DataGrid
                rows={UserList}
                sx={{
                    '& .MuiButton-root': {
                        textTransform: 'capitalize'
                    }
                }}
                slots={{ toolbar: GridToolbar }}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10, 20, { value: UserList.length > 0 ? UserList.length : 1, label: 'All' }]}
                loading={Loading}
            />
        </Box>
    )
}

export default Datatable