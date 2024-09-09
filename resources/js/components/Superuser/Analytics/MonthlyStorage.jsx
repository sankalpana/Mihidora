import React, { useState, useEffect } from "react";
import { Box, IconButton, Menu, MenuItem, Select, FormControl, InputLabel, ListItemIcon, TextField } from "@mui/material";
import MainLayout from "../BaseLayout";
import axios from 'axios';
import swal from 'sweetalert';
import { DataGrid, GridColDef, GridValueGetterParams, GridToolbar } from '@mui/x-data-grid';


function MonthlyStorage() {

    const [Loading, setLoading] = useState([true]);
    const [rows, setRows] = useState([]);


    useEffect(() => {
        console.log('Active Orgs');
        getStorageData({ year: 2024 });
    }, []);

    // data tables
    const columns = [
        { field: 'organization', headerName: 'Organisation', minWidth: 300 },
        { field: 'january', headerName: 'Jan', flex: 1 },
        { field: 'february', headerName: 'Fe', flex: 1 },
        { field: 'march', headerName: 'Mar', flex: 1 },
        { field: 'april', headerName: 'Apr', flex: 1 },
        { field: 'may', headerName: 'May', flex: 1 },
        { field: 'june', headerName: 'Jun', flex: 1 },
        { field: 'july', headerName: 'Jul', flex: 1 },
        { field: 'august', headerName: 'Aug', flex: 1 },
        { field: 'september', headerName: 'Sep', flex: 1 },
        { field: 'october', headerName: 'Oct', flex: 1 },
        { field: 'november', headerName: 'Nov', flex: 1 },
        { field: 'december', headerName: 'Dec', flex: 1 },
    ];

    //API Calls
    // get storage data
    const getStorageData = (data) => {
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post('/api/get-monthly-consumption', data).then(res => {
                if (res.status == 200) {
                    console.log(res.data);
                    let usage = res.data.map((user) => {
                        return {
                            id: user.organization_id,
                            organization: user.organization_name,
                            january: user.january,
                            february: user.february,
                            march: user.march,
                            april: user.april,
                            may: user.may,
                            june: user.june,
                            july: user.july,
                            august: user.august,
                            september: user.september,
                            october: user.october,
                            november: user.november,
                            december: user.december,
                        };
                    });
                    setRows(usage);
                    setLoading(false);
                }
            });
        })
    }

    return (
        <Box sx={{ width: '100%', typography: 'body1' }} className="admin_forms">
            <DataGrid
                rows={rows}
                slots={{ toolbar: GridToolbar }}
                columns={columns}
                sx={{
                    '& .MuiDataGrid-virtualScroller': {
                        minHeight: '300px'
                    }
                }}
                loading={Loading}
            />
        </Box>

    )
}

export default MonthlyStorage;