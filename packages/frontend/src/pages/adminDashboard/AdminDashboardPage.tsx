import { Box } from "@mui/material";
import LocationTable from "../../components/admin/locations/LocationTable";
import UsersTable from "../../components/admin/users/UsersTable";


const AdminDashboardPage = () => {

  return (
    <>
     <Box display="flex" mt={2} flexDirection={{ xs: "column", md: "row" }} gap={2}>
        <Box flex={1}>
          <LocationTable />
        </Box>
        <Box flex={1}>
          <UsersTable />
        </Box>
      </Box>
    </>
  );
};

export default AdminDashboardPage;
