import React, { useState, useEffect } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Box, Grid, Card, CardContent, Typography, FormControl, Select, MenuItem, InputLabel, TextField, Button } from '@mui/material';
import MainLayout from "../BaseLayout";
import axios from 'axios';
import swal from 'sweetalert';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { BarChart } from '@mui/x-charts/BarChart';
import Link from '@mui/material/Link';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

const styles = {
    numbers: {
        '& .MuiPaper-root': {
            borderRadius: '16px'
        }
    },
    counterText: {
        fontSize: '12px'
    },
    breakdownBorder: {
        borderBottom: 'solid 2px black'
    },
    noBreakdownBorder: {
        borderBottom: 'none'
    }
}

function Registrations() {
    const [chartConfig, setChartConfig] = useState({
        xAxis: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        title: 'Showing Registration Count for Past 30 Days',
        width: '100%',
    })
    const [state, setState] = useState({
        duration: 30,
        start: Dayjs().subtract(30, 'day'),
        end: Dayjs(),
        breakdown: 'week'
    });
    const [counters, setCounters] = useState({
        total: 0,
        month: 0,
        week: 0,
    });
    const [loaders, setLoaders] = useState({
        initialLoad: true,
        durationLoad: false,
        filterLoad: false,
        breakdownLoad: false,
        loaderState: false,
    });
    const [errors, setError] = useState({
        error: false,
        errorMessage: ''
    });
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        getRegularCounts();
        //initially load chart with last 30 days data
        getDataFromDurations(30);
    }, []);

    const handleDurationSelection = (e) => {
        setState({
            ...state,
            duration: e.target.value
        });
        getDataFromDurations(e.target.value);
    }

    const handleStartDateChange = (newDate) => {
        setState({
            ...state,
            start: newDate,
        });
    };

    const handleEndDateChange = (newDate) => {
        setState({
            ...state,
            end: newDate
        });
    };

    const renderInput = (props) => (
        <TextField {...props} variant="outlined" size="small" fullWidth />
    );

    const handleBreakdown = (value) => {
        setState({
            ...state,
            breakdown: value
        });
        const data = {
            start: {
                year: state.start.year(),
                month: state.start.month() + 1, // offset the month number 
                date: state.start.date()
            },
            end: {
                year: state.end.year(),
                month: state.end.month() + 1, // offset the month number 
                date: state.end.date()
            }
        }
        getUserCountByDates(data, value);
    }

    const handleFilter = () => {
        console.log(state);
        console.log(state.start.year(), state.start.month(), state.start.date());
        console.log(state.end.year(), state.end.month(), state.end.date());
        let data = {
            start: {
                year: state.start.year(),
                month: state.start.month() + 1, // offset the month number 
                date: state.start.date()
            },
            end: {
                year: state.end.year(),
                month: state.end.month() + 1, // offset the month number 
                date: state.end.date()
            }
        }
        console.log(data);
        setState({
            ...state,
            breakdown: 'week'
        });
        getUserCountByDates(data, 'week');
    }

    //API calls
    const getRegularCounts = () => {
        axios.get(`/api/get-user-counts`).then(res => {
            if (res.data.status === 200) {
                setCounters({ total: res.data.total, month: res.data.month, week: res.data.week });
                setLoaders({ ...loaders, initialLoad: false });
            } else if (res.data.status === 404) {
                console.log(res.data.errors);
                setLoaders({ ...loaders, initialLoad: false });
            } else {
                console.log(res.data.errors);
                setLoaders({ ...loaders, initialLoad: false });
            }
        });
    }
    const getDataFromDurations = (days) => {
        setLoaders({ ...loaders, loaderState: true });
        console.log(days);
        const data = { days: days };
        let API = 'get-user-counts-for-days';
        let title = `Showing registration counts for past ${days} Days`
        if (days == 7) {
            API = 'get-user-counts-for-days';
        }
        if (days == 90) {
            API = 'get-user-counts-for-days-by-week';
            title = `Showing registration counts for past ${days} Days: Breakdown by weeks`
        }
        if (days == 360) {
            API = 'get-user-counts-for-days-by-month';
            title = `Showing registration counts for the past year: Breakdown by months`
        }
        axios.post(`/api/${API}`, data).then(res => {
            if (res.data.status === 200) {
                console.log(res);
                setChartConfig({
                    xAxis: res.data.dates,
                    data: res.data.count,
                    title: title,
                    width: '100%'
                })
                setLoaders({ ...loaders, durationLoad: false });
            } else if (res.data.status === 404) {
                console.log(res.data.errors);
                setLoaders({ ...loaders, durationLoad: false });
            } else {
                console.log(res.data.errors);
                setLoaders({ ...loaders, durationLoad: false });
            }
        });
    }
    const getUserCountByDates = (data, breakdown) => {
        setLoaders({ ...loaders, loaderState: true });
        let API = `get-user-counts-by-weeks`;
        let title = `Showing number or registration from ${state.start.format('DD/MM/YYYY')} to ${state.end.format('DD/MM/YYYY')}: Breakdown by Week`
        if (breakdown == 'week') {
            API = `get-user-counts-by-weeks`;
            title = `Showing number or registration from ${state.start.format('DD/MM/YYYY')} to ${state.end.format('DD/MM/YYYY')} : Breakdown by Week`
        }
        if (breakdown == 'month') {
            API = `get-user-counts-by-months`;
            title = `Showing number or registration from ${state.start.format('DD/MM/YYYY')} to ${state.end.format('DD/MM/YYYY')} : Breakdown by Month`
        }
        if (breakdown == 'year') {
            API = `get-user-counts-by-year`;
            title = `Showing number or registration from ${state.start.format('DD/MM/YYYY')} to ${state.end.format('DD/MM/YYYY')} : Breakdown by Year`
        }
        axios.post(`/api/${API}`, data).then(res => {
            if (res.data.status === 200) {
                console.log(res);
                setChartConfig({
                    xAxis: res.data.results.map((object) => {
                        return object.date
                    }),
                    data: res.data.results.map((object) => {
                        return object.count
                    }),
                    title: title
                })
                setLoaders({ ...loaders, durationLoad: false });
            } else if (res.data.status === 404) {
                console.log(res.data.errors);
                setLoaders({ ...loaders, durationLoad: false });
            } else {
                console.log(res.data.errors);
                setLoaders({ ...loaders, durationLoad: false });
            }
        });
    }

    // Error message handle
    const handleErrorNotification = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setError({ error: false, errorMessage: '' });
    };
    // loading handlers
    const handleClose = () => setLoaders({ ...loaders, loaderState: false });

    // Error notification components
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    function SlideTransition(props) {
        return <Slide {...props} direction="left" />;
    }

    return (
        <Box sx={{ width: '100%', typography: 'body1' }} className="admin_forms">
            <Grid container spacing={2}>
                <Grid item xs={2} sx={styles.numbers}>
                    <Card variant="outlined" sx={{ border: '2px solid #8FA93B' }}>
                        <CardContent sx={{ padding: 1 }}>
                            <Typography variant="h4" gutterBottom sx={{ color: '#8FA93B', mb: 0 }}>
                                <b>{counters.total}</b>
                            </Typography>
                            <Typography variant="subtitle" sx={styles.counterText}>
                                Total Registrations
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={2} sx={styles.numbers}>
                    <Card variant="outlined" sx={{ border: '2px solid #8FA93B' }}>
                        <CardContent sx={{ padding: 1 }}>
                            <Typography variant="h4" gutterBottom sx={{ color: '#8FA93B', mb: 0 }}>
                                <b>{counters.month}</b>
                            </Typography>
                            <Typography variant="subtitle" sx={styles.counterText}>
                                This Month
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={2} sx={styles.numbers}>
                    <Card variant="outlined" sx={{ border: '2px solid #8FA93B' }}>
                        <CardContent sx={{ padding: 1, paddingBottom: '5px' }}>
                            <Typography variant="h4" gutterBottom sx={{ color: '#8FA93B', mb: 0 }}>
                                <b>{counters.week}</b>
                            </Typography>
                            <Typography variant="subtitle" sx={styles.counterText}>
                                This Week
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs>

                </Grid>
            </Grid>

            <Box sx={{ mt: 7 }}>
                <Typography variant="body1" sx={{ mb: 3 }}>Number of Registrations</Typography>

                <Grid container spacing={2} columns={16}>
                    <Grid item xs={3}>
                        <FormControl size="small" fullWidth>
                            <InputLabel id="demo-simple-select-label">Duration</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                name="dateRange"
                                value={state.duration}
                                label="Duration"
                                onChange={handleDurationSelection}
                                sx={{
                                    '& .MuiBackdrop-root': {
                                        '&.Mui-focused': {
                                            color: '#93aa40'
                                        }
                                    }
                                }}
                            >
                                <MenuItem value={7}>Last 7 days</MenuItem>
                                <MenuItem value={30}>Last 30 days</MenuItem>
                                <MenuItem value={90}>Last 90 days</MenuItem>
                                <MenuItem value={360}>Last 1 year</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={3}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                renderInput={renderInput}
                                label="Start Date"
                                value={state.start}
                                onChange={(newValue) => handleStartDateChange(newValue)}
                                inputFormat="DD/MM/YYYY"
                                disableFuture
                            />
                        </LocalizationProvider>
                    </Grid>

                    <Grid item xs={3}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                renderInput={renderInput}
                                label="End Date"
                                value={state.end}
                                onChange={(newValue) => handleEndDateChange(newValue)}
                                inputFormat="DD/MM/YYYY"
                                minDate={state.start}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item style={{ display: "flex", alignItems: "center" }}>
                        <Button className="update-button" sx={{ ml: 2 }} onClick={handleFilter} >Filter</Button>
                    </Grid>
                    <Grid item style={{ display: "flex", alignItems: "center" }}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                typography: 'body1',
                                '& > :not(style) ~ :not(style)': {
                                    ml: 2,
                                },
                            }}
                        >
                            <Link href="#" style={state.breakdown == 'week' ? styles.breakdownBorder : styles.noBreakdownBorder} underline="none" onClick={() => handleBreakdown('week')}>
                                Week
                            </Link>
                            <Link href="#" style={state.breakdown == 'month' ? styles.breakdownBorder : styles.noBreakdownBorder} underline="none" onClick={() => handleBreakdown('month')}>
                                Month
                            </Link>
                            <Link href="#" style={state.breakdown == 'year' ? styles.breakdownBorder : styles.noBreakdownBorder} underline="none" onClick={() => handleBreakdown('year')}>
                                Year
                            </Link>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle" sx={styles.counterText}>
                    {chartConfig.title}
                </Typography>
            </Box>

            <Box sx={{ mt: 1 }}>
                <BarChart
                    xAxis={[
                        {
                            id: 'barCategories',
                            data: chartConfig.xAxis,
                            scaleType: 'band',
                        },
                    ]}
                    yAxis={[
                        { label: 'No of Registrations', }
                    ]}
                    series={[
                        {
                            data: chartConfig.data
                        },
                    ]}
                    height={500}
                    sx={{
                        width: chartConfig.width,
                        '& .MuiBarElement-root': {
                            fill: '#c6d697',
                            transition: 'fill 0.5s ease-in-out',
                        },
                        '& .MuiChartsAxis-root.MuiChartsAxis-bottom .MuiChartsAxis-tickLabel, .MuiChartsAxis-root.MuiChartsAxis-bottom .MuiChartsAxis-label': {
                            textAnchor: 'end',
                            transform: 'rotate(-40deg)',
                        },
                        '& .MuiChartsAxis-line': {
                            stroke: '#93aa40'
                        },
                        '& .MuiChartsAxis-tick': {
                            stroke: '#93aa40'
                        }
                    }}
                    margin={{ top: 80, right: 30, left: 40, bottom: 160 }}
                />
            </Box>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={errors.error} autoHideDuration={5000}
                onClose={handleErrorNotification}
                TransitionComponent={SlideTransition}
                key="Slide">
                <Alert onClose={handleErrorNotification} severity="error" sx={{ width: '100%' }}>
                    {errors.errorMessage}
                </Alert>
            </Snackbar>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loaders.loaderState}
                onClick={handleClose}
            >
                <CircularProgress color="success" />
            </Backdrop>
        </Box>
    )
}

export default Registrations;