import linksData from "../data/sideNavLinks.json";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SupervisedUserCircleOutlinedIcon from '@mui/icons-material/SupervisedUserCircleOutlined';
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { JSX } from "react";
import TefilinIcon from "../components/tefillinIcon";

const iconMap: Record<string, JSX.Element> = {
    dashboard: <DashboardIcon />,
    home: <HomeIcon />,
    people: <PeopleIcon />,
    users: <SupervisedUserCircleOutlinedIcon />,
    settings: <SettingsIcon />,
    tefillin: <TefilinIcon />,
    locations: <LocationOnIcon />,
};

export function useSideNavLinks() {
    return linksData.map((link) => ({
        ...link,
        icon: iconMap[link.icon]
    }));
}