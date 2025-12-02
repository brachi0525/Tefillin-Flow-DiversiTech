import React, { useEffect, useState } from 'react';
import TefillinMediaForm from './TefillinMediaForm';
import { useTefillinMediaUploader } from '../../services/media/mediaService';
import { Paper, Snackbar, Alert } from '@mui/material';

interface Props {
  id: string;
  onSuccess?: () => void;
}

const TefillinMediaUploader: React.FC<Props> = ({ id, onSuccess }) => {
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
const { uploadMedia, errorMessage } = useTefillinMediaUploader(() => {
    setSuccessOpen(true);
    onSuccess?.();
  });

  useEffect(() => {
    if (errorMessage) {
      setErrorOpen(true);
    }
  }, [errorMessage]);
  
  return (
    <>
      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
          minWidth: 260,
          maxWidth: 360,
          width: '100%',
          transition: 'box-shadow 0.2s',
          '&:hover': {
            boxShadow: 4,
          },
        }}
      >
        <TefillinMediaForm id={id} onTransfer={uploadMedia} />
      </Paper>

      <Snackbar
        open={successOpen}
        autoHideDuration={4000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessOpen(false)} sx={{ width: '100%' }}>
          התמונות הועלו בהצלחה!
        </Alert>
      </Snackbar>
      <Snackbar
        open={errorOpen}
        autoHideDuration={6000}
        onClose={() => setErrorOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setErrorOpen(false)} sx={{ width: '100%' }}>
          {errorMessage || 'אירעה שגיאה בהעלאה'}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TefillinMediaUploader;
