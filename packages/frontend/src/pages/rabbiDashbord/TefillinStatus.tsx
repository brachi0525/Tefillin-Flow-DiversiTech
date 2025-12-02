import React from 'react';
import { Box, Paper, CircularProgress } from '@mui/material';

import { useTefillinList } from '../../services/tefillinService';
import GenericTefillinStatusTable from '../../components/tefillinDashboard/GenericTefillinStatusTable';

const TefillinStatus: React.FC = () => {
  const { data: tefillin = [], isLoading, error } = useTefillinList({});
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
      {/* רקע דקורטיבי */}
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
      {/* שגיאה */}
      {error && (
        <Paper sx={{ p: 2, mb: 2, backgroundColor: 'error.light', color: 'error.contrastText' }}>
          {typeof error === 'string'
            ? error
            : 'message' in error && error.message
              ? error.message
              : 'status' in error && typeof error.status === 'string'
                ? error.status
                : 'אירעה שגיאה.'}
        </Paper>
      )}
      {/* טבלה */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <GenericTefillinStatusTable rows={tefillin} />
      )}
    </Box>
  );
};
export default TefillinStatus;