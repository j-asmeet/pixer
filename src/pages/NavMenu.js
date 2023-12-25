import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { AccountCircle, CloudUpload, PhotoLibrary } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NavMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignout = () => {
    localStorage.setItem("email", "");
    navigate("/");

  };

  const handleGalleryClick = () => {
    navigate("/gallery");
  };

  return (
    <AppBar position="static">
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          Pixer
        </Typography>
        <div>
          <IconButton color="inherit" component={RouterLink} to="/upload">
            <CloudUpload />
          </IconButton>
          <IconButton color="inherit" onClick={handleGalleryClick}>
            <PhotoLibrary />
          </IconButton>
          <IconButton color="inherit" onClick={handleMenu}>
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleSignout}>Sign Out</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavMenu;
