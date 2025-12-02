import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Stack,
  TextField,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
  id: string;
  onTransfer: (id: string, imageFiles: File[], message?: string) => void;
}


const TefillinMediaForm: React.FC<Props> = ({ id, onTransfer }) => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
const [message, setMessage] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImageFiles(prev => {
      const all = [...prev, ...acceptedFiles];
      const unique = Array.from(new Map(all.map(file => [file.name, file])).values());
      return unique;
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });

  const handleRemoveImage = (fileName: string) => {
    setImageFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const handleClearAll = () => {
    setImageFiles([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageFiles.length > 0) {
onTransfer(id, imageFiles, message);
      setImageFiles([]);
          setMessage('');

    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}
    >
      <Typography variant="h6" color="primary">
        העלאת תמונות לתפילין
      </Typography>
<TextField
  label="הארה (לא חובה)"
  variant="outlined"
  fullWidth
  value={message}
  onChange={(e) => setMessage(e.target.value)}
/>
      <Paper
        {...getRootProps()}
        sx={{
          padding: 2,
          border: '2px dashed #ccc',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? '#f0f0f0' : 'transparent',
        }}
      >
        <input {...getInputProps()} />
        <Typography>
          {isDragActive ? 'שחרר את הקבצים כאן' : 'גרור ושחרר תמונות כאן או לחץ לבחירה'}
        </Typography>
      </Paper>

      {imageFiles.length > 0 && (
        <Box>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            {imageFiles.map(file => {
              const preview = URL.createObjectURL(file);
              return (
                <Box
                  key={file.name}
                  sx={{ position: 'relative', width: 100, height: 100 }}
                >
                  <img
                    src={preview}
                    alt={file.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 4,
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(file.name)}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      backgroundColor: 'rgba(255,255,255,0.7)',
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              );
            })}
          </Stack>

          <Button onClick={handleClearAll} color="secondary" sx={{ mt: 1 }}>
            נקה הכל
          </Button>
        </Box>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={imageFiles.length === 0}
      >
        שלח תמונות
      </Button>
    </Box>
  );
};

export default TefillinMediaForm;
