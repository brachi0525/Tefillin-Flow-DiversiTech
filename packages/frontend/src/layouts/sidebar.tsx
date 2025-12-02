import { useMediaQuery, useTheme } from "@mui/material";
import SideNav from "../components/navigation/SideNav";

const Sidebar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    return (
        isMobile ? null : <SideNav />
    );
}
export default Sidebar