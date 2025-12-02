import { useCreateMutation } from '../apiClient';
import { useState } from 'react';
const path = '/media';
export const useAddTefillinMedia = () => {
  const [createMutation, result] = useCreateMutation<any>();

  const createTefillinMedia = (id: string, files: File[], message?: string) => {
    const formData = new FormData();
    formData.append('id', id);
    if (message) formData.append('message', message);
    files.forEach(file => {
      formData.append('files', file);
    });

    return createMutation({
      path: `${path}/upload-tefillin-photo`,
      body: formData,
    });
  };

  return [createTefillinMedia, result] as const;
};



export const useAddDistributionsMedia = () => {
  console.log("useAddDistributionsMedia called");

  const [createMutation, result] = useCreateMutation<any>();
  const uploadImage = async (files: File[], description: string, tefillin_id: string, soldier_id: string, locationId: string) => {
    const formData = new FormData();
    formData.append('tefillin_id', tefillin_id);
    formData.append('description', description);
    formData.append('soldier_id', soldier_id);
    formData.append('locationId', locationId);
    formData.append('folderId', process.env.DISTRIBUTIONS_FOLDER_ID || '1PqzOUL57mjDUSXsBuGztthdDRcxOO2xo?dmr=1&ec=wgc-drive-hero-goto');
    files.forEach(file => {
      formData.append('files', file);
    });

    return createMutation({
      path: `${path}/upload-media`,
      body: formData,
    });

  };
  return [uploadImage, result] as const;
}



export function useTefillinMediaUploader(onSuccess?: () => void) {
  const [upload, result] = useAddTefillinMedia();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
const uploadMedia = async (id: string, files: File[], message?: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
  await upload(id, files, message);
   if (result.error) {
    throw new Error(result.error.data.message || 'שגיאה לא ידועה מהשרת');
      }
      onSuccess?.();
    } catch (err:any) {
      console.log('Media upload failed:', err);
       setErrorMessage(err?.message || 'אירעה שגיאה בהעלאת התמונות');
    } finally {
      setLoading(false);
    }
  };
  return {
    uploadMedia,
    loading,
    errorMessage,
  };
}

export const useGetMediaByTefillinId = (parentFolderId: string, subFolderId: string) => {
  const [createMutation, result] = useCreateMutation<any>();

  const getMedia = async () => {
    try {
      const response = await createMutation({
        path: `${path}/loading-tefillin-photo`,
        body: { parentFolderId, subFolderId },
      }).unwrap();      
    } catch (error) {
      console.error("Error during mutation:", error);
    }
  }

  return {
    ...result,
    getMedia
  };
};

export const useGetMediaGalleryByTefillinId = (tefillin_id: string, limit = 10, offset = 0) => {
  const [createMutation, result] = useCreateMutation<any>();
   
  const getMediaGallery = async () => {
    try {
      const response = await createMutation({
        path,  
        body: {
          filters: { tefillin_id },  
          limit,
          offset
        },
      }).unwrap();
      return response;
    } catch (error) {
      console.error("Error during mutation:", error);
      throw error; 
    }
  };

  return {
    ...result,
    getMediaGallery
  };
};

export const useShowSoliderMedia = () => {
  console.log("useShowSoliderMedia called");
  const [createMutation, result] = useCreateMutation<any>();
  const loadingImage = async (id: string) => {
    return createMutation({
      path: `${path}/loading-solider-photo`,
      body: {
        filters: { "soldier_id": id }
      }
    });

  };
  return [loadingImage, result] as const;
}

