import React from 'react';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

export interface NavLinkProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    selected?: boolean;
}


const NavLink: React.FC<NavLinkProps> = ({ to, icon, label, selected }) => {
    return (
        <ListItem component={Link} to={to} >
            <ListItemButton component={Link}
                to={to}
                selected={selected} sx={{
                    '&.Mui-selected:active, &:active': {
                        bgcolor: 'primary.main',
                    },
                    '& .MuiTouchRipple-root span': {
                        bgcolor: 'primary.main',
                    },
                }}>
                <ListItemText primary={label} sx={{ color: 'text.secondary' }} />
                <ListItemIcon>{icon}</ListItemIcon>
            </ListItemButton>
        </ListItem >
    );
};

export default NavLink;