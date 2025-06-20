import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Appbar from "../components/Appbar";
import Footer from "../components/Footer";


const Layout = () => {
  console.log("Layout component rendering");
  
  return (
    <Box className="app-container" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* App Bar at the top */}
      <Appbar />

      {/* Main content section */}
      <Box 
        component="main" 
        className="main-content"
        sx={{ 
          flex: 1,
          // pt: { xs: 7, sm: 8 }, // Add padding top to account for AppBar height
          minHeight: '100vh'
        }}
      >
        <Outlet /> {/* This will render child pages */}
      </Box>

    <Footer/>

    </Box>
  );
};

export default Layout;