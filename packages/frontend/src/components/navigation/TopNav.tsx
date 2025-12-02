import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { useTopNavLinks } from "../../hooks/useTopNavLink";
import NavLink from "./NavLink";
import UserAvatarMenu from "../userProfile/UserAvatarMenu";
import Notifications from "../notifications/Notifications";
import { currentUser } from '../../features/user/userSlice';
import { useSelector } from "react-redux";



const TopNav = () => {

    const links = useTopNavLinks();
    const user = useSelector(currentUser);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('he-IL', options);

    return (

        <AppBar position="static" sx={{ bgcolor: 'background.paper', direction: 'rtl' }}>
            <Toolbar>
                <Notifications />
                <Box sx={{ direction: 'rtl', display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    {user ?
                        <Typography sx={{ color: 'primary.main', fontSize: 'larger', fontWeight: 'bold' }}> {user?.name} שלום</Typography>
                        : null}
                    <Typography sx={{ color: 'text.secondary' }}>{today}</Typography>
                </Box>
                <Box sx={{ flexGrow: 1, display: "flex" }}>
                    {links.map((link, index) => (
                        <NavLink key={index} to={link.to} icon={link.icon} label={link.label}></NavLink>
                    ))}
                </Box>

                <UserAvatarMenu />

            </Toolbar>
        </AppBar>
    )
}

export default TopNav;
