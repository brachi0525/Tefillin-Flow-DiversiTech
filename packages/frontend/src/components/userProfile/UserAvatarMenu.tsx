import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  Drawer,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { currentUser, clearUser } from '../../features/user/userSlice';
import UserProfile from './UserProfile';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../hooks/AuthContext';

const UserAvatarMenu = () => {
  const theme = useTheme();
  const user = useSelector(currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const open = Boolean(anchorEl);
  const { logout } = useAuth();
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleProfile = () => {
    setIsDrawerOpen(true);
    handleClose();
  };

const handleLogout = () => {
    logout();
    dispatch(clearUser());
    handleClose();
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const avatarSx = (hasImage: boolean) => ({
    width: 44,
    height: 44,
    bgcolor: hasImage ? 'transparent' : theme.palette.primary.main,
    color: hasImage ? 'inherit' : '#fff',
    fontWeight: 600,
    border: `2px solid ${theme.palette.primary.light}`,
    boxShadow: theme.shadows[3],
  });

  return (
    <Box>
      {!user ? (
        <Tooltip title="התחבר" >
          <IconButton onClick={handleLogin} size="large" >
            <Avatar sx={avatarSx(false)}>
            </Avatar>
          </IconButton >
        </Tooltip>
      ) : (
        <>
          <Tooltip title={`שלום, ${user.name}`}>
            <IconButton onClick={handleOpen} size="large">
              <Avatar
                src={user.profileImageUrl || undefined}
                alt={user.name}
                sx={avatarSx(!!user.profileImageUrl)}
              >
                {!user.profileImageUrl && user.name?.[0]}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 8,
              sx: {
                borderRadius: 3,
                minWidth: 200,
                mt: 1.5,
                px: 1,
                py: 0.5,
                backgroundColor:
                  theme.palette.mode === 'dark' ? '#2c2c2ccc' : '#ffffffee',
                backdropFilter: 'blur(6px)',
                boxShadow: `0px 8px 20px ${theme.palette.mode === 'dark' ? '#00000088' : '#cccccc88'
                  }`,
              },
            }}
          >
            <Box px={2} pt={1}>
              <Typography variant="subtitle2" color="text.secondary">
                שלום,
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {user.name}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <MenuItem onClick={handleProfile}>
              <Typography variant="body2" fontWeight={500}>
                פרופיל
              </Typography>
              <AccountCircleIcon/>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Typography variant="body2" fontWeight={500}>
                התנתק
              </Typography>
              <LogoutIcon/>
            </MenuItem>
          </Menu>

          <Drawer
            anchor="left"
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            PaperProps={{
              sx: {
                width: 400,
                bgcolor: 'background.default',
              },
            }}
          >
            <Box sx={{ p: 3 }}>
              <UserProfile onClose={() => setIsDrawerOpen(false)} />
            </Box>
          </Drawer>
        </>
      )}
    </Box>
  );
};

export default UserAvatarMenu;
