import Box from '@mui/material/Box';
import { Drawer, Typography, useTheme } from '@mui/material';
import WaitingSoldeirsTable from '../../components/managerDashboard/soldiersSection/WaitingSoldiersTable';
import AllSoldiersTable from '../../components/managerDashboard/soldiersSection/AllSoldiersTable';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import SoldierDetailsPanel from '../../components/managerDashboard/soldiersSection/SoldierDetailsPanel';
import { Soldier } from '../../features/soldier/soldierTypes';
import StatusOverview from '../../components/managerDashboard/soldiersSection/SoldiersStatusOverview';
import { useGetAllSoldier, useStatusOverview } from '../../services/soldierService ';


const drawerWidth = 450;

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

export default function ManagerDashboard() {
  const { data: soldiers = [], isLoading, error } = useGetAllSoldier();

  const statusOverview = useStatusOverview();
  const theme = useTheme();

  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSoldierSelect = (soldier: Soldier) => {
    setSelected(soldier);
    handleDrawerOpen();
  };

  const [selected, setSelected] = useState<Soldier | null>(null);

  return (
    <>
      <StatusOverview
        statusCounts={statusOverview?.statusCounts ?? {
          registered: statusOverview?.statusCounts?.registered ?? 0,
          approved: statusOverview?.statusCounts?.approved ?? 0,
          paid: statusOverview?.statusCounts?.paid ?? 0,
          scheduled: statusOverview?.statusCounts?.scheduled ?? 0,
          received: statusOverview?.statusCounts?.received ?? 0,
        }}
        totalSoldiers={statusOverview?.totalSoldiers ?? 0}
      />
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
          <SoldierDetailsPanel selected={selected} onDrawerClose={handleDrawerClose} open={open} />
        </Drawer>
        <Main open={open}>
          <AllSoldiersTable
            soldiers={soldiers}
            isLoading={isLoading}
            handleSoldierSelect={handleSoldierSelect}
          />
          <WaitingSoldeirsTable />
        </Main>
      </Box >
    </>


  );
}
