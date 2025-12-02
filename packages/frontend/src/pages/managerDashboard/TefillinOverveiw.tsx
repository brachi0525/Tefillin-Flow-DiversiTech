import React from 'react';
import { Box, Paper, CircularProgress } from '@mui/material';

import { TefillinStatus } from '../../features/tefillin/tefillinTypes';
import { useTefillinList, useTransferTefillin, useUpdateTefillinStatus } from '../../services/tefillinService';
import TefillinStatusTable from '../../components/tefillinDashboard/TefillinStatusTable';

const InventoryDashboard: React.FC = () => {
  const { data: tefillin = [], isLoading, error, refetch } = useTefillinList({});
  const [updateStatus] = useUpdateTefillinStatus();
  const [transfer] = useTransferTefillin();

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateStatus(id, newStatus as TefillinStatus);
    refetch();
  };

  const handleTransfer = async (id: string, toLocation: string) => {
    await transfer(id, toLocation);
    refetch();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: { xs: 1, md: 4 },
        maxWidth: 1400,
        mx: 'auto',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 30, md: 60 },
          left: { xs: -80, md: -120 },
          width: { xs: 180, md: 260 },
          height: { xs: 180, md: 260 },
          bgcolor: 'primary.main',
          opacity: 0.10,
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 20, md: 60 },
          right: { xs: -60, md: -100 },
          width: { xs: 120, md: 200 },
          height: { xs: 120, md: 200 },
          bgcolor: 'secondary.main',
          opacity: 0.13,
          borderRadius: '50%',
          zIndex: 0,
        }}
      />

     
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TefillinStatusTable
          rows={tefillin}
          onStatusChange={handleStatusChange}
          onTransfer={handleTransfer}
        />
      )}
    </Box>
  );
};

export default InventoryDashboard;
