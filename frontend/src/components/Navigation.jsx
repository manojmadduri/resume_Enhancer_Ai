import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Description,
  Home,
  Person,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const navigationItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Resumes', icon: <Description />, path: '/resumes' },
    { text: 'Profile', icon: <Person />, path: '/profile' },
  ];

  const drawer = (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ 
        fontWeight: 700,
        color: 'primary.main',
        mb: 3,
      }}>
        Resume Enhancer
      </Typography>
      <List>
        {navigationItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              handleDrawerToggle();
            }}
            sx={{
              borderRadius: 1,
              mb: 1,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{
                fontWeight: 500,
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, sm: 70 } }}>
            {isMobile && (
              <IconButton
                color="primary"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                flexGrow: { xs: 1, md: 0 },
                mr: { md: 4 }
              }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  fontSize: { xs: '1.2rem', sm: '1.5rem' },
                  letterSpacing: '-0.5px'
                }}
              >
                Resume Enhancer
              </Typography>
            </Box>

            {!isMobile && currentUser && (
              <Box sx={{ display: 'flex', flexGrow: 1, gap: 1 }}>
                {navigationItems.map((item) => (
                  <Button
                    key={item.text}
                    onClick={() => navigate(item.path)}
                    sx={{
                      px: 2,
                      py: 1,
                      color: 'text.primary',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                    startIcon={item.icon}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            )}

            {currentUser ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Tooltip title="Account settings">
                  <IconButton 
                    onClick={handleOpenUserMenu}
                    sx={{ 
                      p: 0.5,
                      border: '2px solid',
                      borderColor: 'primary.main',
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 35, 
                        height: 35,
                        bgcolor: 'primary.main',
                      }}
                    >
                      <AccountCircle />
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  PaperProps={{
                    elevation: 2,
                    sx: {
                      minWidth: 200,
                      mt: 1.5,
                      '& .MuiMenuItem-root': {
                        px: 2,
                        py: 1.5,
                      },
                    },
                  }}
                >
                  <MenuItem onClick={() => {
                    handleCloseUserMenu();
                    navigate('/profile');
                  }}>
                    <ListItemIcon>
                      <Person fontSize="small" color="primary" />
                    </ListItemIcon>
                    <Typography>Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" color="error" />
                    </ListItemIcon>
                    <Typography color="error.main">Logout</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button
                  variant="text"
                  onClick={() => navigate('/login')}
                  sx={{ 
                    color: 'text.primary',
                    fontWeight: 500,
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/register')}
                  sx={{
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                  }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: 'background.paper',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation;
