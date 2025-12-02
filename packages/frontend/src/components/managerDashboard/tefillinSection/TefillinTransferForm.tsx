import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

interface Props {
  onTransfer: (id: string, toLocation: string) => void;
}

const TefillinTransferForm: React.FC<Props> = ({ onTransfer }) => {
  const [serial, setSerial] = useState('');
  const [toLocation, setToLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (serial && toLocation) {
      onTransfer(serial, toLocation);
      setSerial('');
      setToLocation('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="מספר סידורי"
        value={serial}
        onChange={e => setSerial(e.target.value)}
        required
        fullWidth
        variant="outlined"
      />
      <TextField
        label="העבר למיקום"
        value={toLocation}
        onChange={e => setToLocation(e.target.value)}
        required
        fullWidth
        variant="outlined"
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        העבר
      </Button>
    </Box>
  );
};

export default TefillinTransferForm;