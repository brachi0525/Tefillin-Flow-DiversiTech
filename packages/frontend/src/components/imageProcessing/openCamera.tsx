import React, { useState } from 'react';
import { CameraInput } from './cameraInput';
import { ImagePreview } from './imagePreview';
import { compressImage } from './imageCompression';
import { useAddDistributionsMedia } from '../../services/media/mediaService';
import { compressVideo } from "./videoCompression";
import Spinner from './spinner';
import { Box, Stack } from '@mui/material';

interface OpenCameraProps {
  tefillin_id: string;
  soldier_id: string;
  locationId?: string;
}

export const OpenCamera: React.FC<OpenCameraProps> = ({ tefillin_id, soldier_id, locationId }) => {
  const [imagePreviews, setImagePreviews] = useState<File[]>([]);
  const [addMedia, mediaResult] = useAddDistributionsMedia();
  const [descriptions, setDescriptions] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const newPreviews: File[] = [];

  const handleFilesSelected = async (files: FileList) => {
    setLoading(true);
    for (const file of Array.from(files)) {
      try {
        let compressedFile: File = file;
        if (file.type.startsWith('video/')) {
          compressedFile = await compressVideo(file);
        } else if (file.type.startsWith('image/')) {
          compressedFile = await compressImage(file);
        }

        newPreviews.push(compressedFile);
      } catch (error) {
        console.error('Error while processing media:', error);
      }
    }
    setImagePreviews(prev => [...prev, ...newPreviews]);
    setLoading(false);
  };


  const handleSubmit = async () => {
    await addMedia(imagePreviews, descriptions, tefillin_id, soldier_id, locationId || '');
    setImagePreviews([]);
    setDescriptions('');
    setErrorMessage('המדיה נשמרה בהצלחה');
  };

  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        margin: 'auto',
      }}
    >
      <CameraInput onFilesSelected={handleFilesSelected} />
      {loading ? (
        <Spinner />
      ) : (
        <ImagePreview imagePreviews={imagePreviews} setImagePreviews={setImagePreviews} onSubmit={handleSubmit} descriptions={descriptions} setDescriptions={setDescriptions} errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
      )}

    </Box>
  );
};