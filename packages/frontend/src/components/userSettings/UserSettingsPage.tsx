import React, { useState } from 'react';
import {
    IconButton,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Divider,
    Typography,
    Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

interface UserSettingsProps {}

const UserSettings = ({}: UserSettingsProps) => {
    const [isVisible, setIsVisible] = useState(true);
    const navigate = useNavigate();

    const handleClose = () => {
        setIsVisible(false);
        navigate('/');
    };

    if (!isVisible) return null;

    const linkItems = [
        { label: 'התנתקות', path: '/logout' },
        { label: 'התראות', path: '/notifications' },
        { label: 'עריכת טקסטים אתר ציבורי', path: '/text-editor' },
        { label: 'ניהול מדיה אתר ציבורי', path: '/media' },
    ];

    return (
        <Drawer
            anchor="right"
            open={isVisible}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    width: 280,
                    backgroundColor: '#f7f7f7',
                    color: '#333',
                    direction: 'rtl',
                    paddingTop: 2,
                },
            }}
        >
            <Box display="flex" justifyContent="flex-start" px={1}>
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Typography variant="h6" align="center" gutterBottom>
                הגדרות משתמש
            </Typography>
            <Divider sx={{ backgroundColor: '#ccc' }} />
            <List>
                {linkItems.map((item) => (
                    <ListItemButton
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        sx={{
                            textAlign: 'right',
                            px: 2,
                            py: 1.5,
                            color: '#1976d2',
                            '&:hover': {
                                backgroundColor: '#e0e0e0',
                            },
                            cursor: 'pointer',
                        }}
                    >
                        <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{ fontSize: '1rem' }}
                        />
                    </ListItemButton>
                ))}
            </List>
        </Drawer>
    );
};

export default UserSettings;
