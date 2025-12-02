import { Drawer, List } from "@mui/material";
import NavLink from "./NavLink";
import { useLocation } from "react-router";
import { useSideNavLinks } from "../../hooks/useSideNavLinks";
import { getUserRole } from '../authorization/ProtectedRoute';
import { defaultUser } from "../../test/mocks/defaultUser";// This is a temporary solution for testing purposes


const SideNav = () => {

    const links = useSideNavLinks();
    const location = useLocation();
    return (
        <Drawer variant="permanent" anchor="right"
            sx={{
                width: 220, flexShrink: 0, '& .MuiDrawer-paper': {
                    width: 220,
                    boxSizing: 'border-box',
                },
            }}
        >
            <List>
                {links
                    // .filter((link) => {
                    //     const role = defaultUser.role; // meanwhile use defaultUser for testing
                    //     //   const role = getUserRole();
                    //     if (!link.allowedRoles) return false;
                    //     return role !== null && link.allowedRoles.includes(role);
                    // })
                    .map((link, index) => {
                        const isHome = link.to === "/";
                        const selected = isHome
                            ? location.pathname === "/"
                            : location.pathname.startsWith(link.to);
                        return (
                            <NavLink
                                key={index}
                                to={link.to}
                                icon={link.icon}
                                label={link.label}
                                selected={selected}
                            />
                        );
                    })}
            </List>
        </Drawer>
    );
};
export default SideNav;