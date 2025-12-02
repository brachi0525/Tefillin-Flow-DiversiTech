import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';


import { Box, TextField, Button, Snackbar ,IconButton} from '@mui/material';
import GenericButton from "../generics/GenericButton"; 
interface ImagePreviewProps {
      imagePreviews: File[];
      setImagePreviews: React.Dispatch<React.SetStateAction<File[]>>;
      onSubmit: () => void;
      descriptions: string;
      setDescriptions: React.Dispatch<React.SetStateAction<string>>;
      errorMessage: string;
      setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ imagePreviews, setImagePreviews, onSubmit, descriptions, setDescriptions, errorMessage, setErrorMessage }) => {

      const removeFile = (index: number) => {
            setImagePreviews(prev => prev.filter((_, i) => i !== index));
      };


      const handleInputChange = (type: string, value: string) => {
            if (type === "description") 
                  setDescriptions(value);
      };

      const handleCloseSnackbar = () => {
            setErrorMessage('');
      };

      const handleSubmit = (e: React.FormEvent) => {
            if (imagePreviews.length > 0) {
                  e.preventDefault();
                  onSubmit();
            }
      };

      return (
            <Box
                  component="form"
                  onSubmit={handleSubmit} 
            >
                
                  {imagePreviews.map((file, index) => {
                        const previewUrl = URL.createObjectURL(file);
                        return (
                              <Box key={index} sx={{ mb: 2 ,position: 'relative' }} >
                                    {file.type.startsWith('video/') ? (
                                          <video src={previewUrl} controls width={100} height={100} />
                                    ) : (
                                          <img src={previewUrl} alt="Preview" width={100} height={100} />
                                          
                                    )}
                                    {<IconButton
                                          size="small"
                                          onClick={() => removeFile(index)}
                                          sx={{
                                                position: 'absolute',
                                                top: 7,
                                                right: 210,
                                                backgroundColor: 'rgba(255,255,255,0.7)'
                                          }}
                                    >
                                          <DeleteIcon fontSize="small" />
                                    </IconButton>}
                              </Box>
                        );
                  })}
                  <TextField
                        label="תיאור"
                        value={descriptions}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        multiline
                        fullWidth
                        required
                        rows={4}
                        variant="outlined"
                        sx={{ mb: 1 }}
                  />
                  <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                  >
                        שלח מדיה
                  </Button>
                  <Snackbar
                        open={!!errorMessage}
                        message={errorMessage}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                        sx={{
                              '& .MuiSnackbarContent-root': {
                                    backgroundColor: '#76b5e4ff',
                                    color: '#ffffff',
                                    fontWeight: 'bold',
                                    borderRadius: '8px',
                              },
                        }}
                  />
            </Box>
      );
};

