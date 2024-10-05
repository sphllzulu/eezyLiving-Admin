import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

const Navbar = () => {

  return (
    <AppBar position="static" color="primary" sx={{background:'black'}}>
      <Toolbar>
        {/* Logo Section */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {/* Replace with an actual logo if needed */}
            Eezy Living
          </Typography>
        </Box>

        {/* Account Icon */}
        <Link to='/'>
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          aria-label="account"
        >
          <AccountCircle />
        </IconButton>
        </Link>
        
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
