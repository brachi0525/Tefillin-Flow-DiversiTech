import { useState } from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useSideNavLinks } from "./../../hooks/useSideNavLinks";
import { useNavigate } from "react-router";

const BottomNav = () => {


    const [value, setValue] = useState(0);
    const navigate = useNavigate();
    const links = useSideNavLinks();

    return (
        <BottomNavigation showLabels value={value} onChange={(_, newValue) => {
            setValue(newValue);
            navigate(links[newValue].to);
        }}>
            {links.map((link, index) => (
                <BottomNavigationAction key={index} label={link.label} icon={link.icon} />
            ))}
        </BottomNavigation>
    )
};

export default BottomNav;