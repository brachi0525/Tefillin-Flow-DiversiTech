import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import LocationTable from '../../components/managerDashboard/locationSection/LocationTable';
import { useGetLocations } from '../../services/locationService';
import LocationDetailsCard from '../../components/managerDashboard/locationSection/LocationDetailsCard';
import { Location } from '../../features/location/locationTypes';
import GenericLoading from '../../components/generics/genericLoading/GenericLoading';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
}));


export default function LocationOverview() {
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLocationSelect = (location: Location) => {
    setSelected(location);
    handleDrawerOpen();
  };

  const { data: locations = [], isLoading, error } = useGetLocations();
  const [selected, setSelected] = React.useState<Location | null>(null);


  if (isLoading) return <GenericLoading />;
  if (error) return <div>שגיאה בטעינת נתונים</div>;



  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <LocationDetailsCard selected={selected} onDrawerClose={handleDrawerClose} open={open} />
      </Drawer>
      <Main open={open}>
        <LocationTable
          locations={locations}
          isLoading={isLoading}
          handleLocationSelect={handleLocationSelect}
        />
      </Main>
    </Box >
  );
}
