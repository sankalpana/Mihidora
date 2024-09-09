// App.js
import React, { useState } from 'react';
import { CssBaseline, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MainContent from './MainContent';

const FMap = ({ topic }) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [markers, setMarkers] = useState([]);

  const handleSidebarOpen = () => {
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleSelectChange = (values) => {
    setSelectedLocation(values.location);
    setSelectedTag(values.tag);
  };

  const updateMarkers = (newMarkers) => {
    setMarkers(newMarkers);
  };

  return (
    <>
      <CssBaseline />
      <TopBar handleOpen={handleSidebarOpen} />
      {isLargeScreen ? (
        <Sidebar isOpen={isSidebarOpen} handleClose={handleSidebarClose} handleSelectChange={handleSelectChange}  updateMarkers={updateMarkers} topic={topic} />
      ) : (
        <Sidebar isOpen={isSidebarOpen} handleClose={handleSidebarClose} handleSelectChange={handleSelectChange} updateMarkers={updateMarkers} topic={topic} />
      )}
      <MainContent selectedLocation={selectedLocation} selectedTag={selectedTag} markers={markers} setMarkers={setMarkers}/>
    </>
  );
};

export default FMap;
