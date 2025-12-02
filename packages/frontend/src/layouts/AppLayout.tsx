import { Outlet } from "react-router-dom";
import Header from "../layouts/header";
import Sidebar from "../layouts/sidebar";
import Footer from "../layouts/footer";
import ErrorBoundary from "../components/ErrorBoundary";
import { useLoading } from "../components/generics/genericLoading/LoadingContext";
import { Box, useTheme } from "@mui/material";

const AppLayout = () => {

    const { loading } = useLoading();
    const theme = useTheme();

    return (
        <ErrorBoundary>
            <Box sx={{ display: "flex", flexDirection: "row", height: "100vh" }}>
                <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0, height: '100vh' }}>
                    <Header />
                    <Box component="main" sx={{
                        flexGrow: 1,
                        bgcolor: theme.palette.background.default,
                        overflow: "auto",
                        margin: 0
                    }}>
                        <Outlet />
                    </Box>
                    <Footer />
                </Box>
                <Sidebar />
            </Box>
            {/* )} */}
        </ErrorBoundary>
    );
};

export default AppLayout;