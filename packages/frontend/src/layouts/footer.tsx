import { useMediaQuery, useTheme } from "@mui/material";
import BottomNav from "../components/navigation/BottomNav";

const Footer = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <footer dir="rtl" style={{ width: '100%' }}>
            {isMobile ? <BottomNav /> : null}
        </footer>
    );
};

export default Footer;