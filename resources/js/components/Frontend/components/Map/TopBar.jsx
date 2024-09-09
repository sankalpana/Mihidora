import React from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import TuneIcon from '@mui/icons-material/Tune';

function TopBar({ handleOpen }) {
  return (
    <AppBar position="fixed" sx={{ backgroundColor:'#93aa40' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={handleOpen}>
          <TuneIcon />
        </IconButton>
        <Typography variant="h6">Filters</Typography>
      </Toolbar>
    </AppBar>
  );
};
export default TopBar;