import { NextFunction, Request, Response } from 'express';
import { MediaService } from '../services/mediaService';
import { loadingFilesFromTheDrive } from '../../../ETL/src/integrations/googleDrive/utils/laodingMedia';
import { ContentService } from '../services/contentService';

const mediaService = new MediaService();
   const contentService = new ContentService();
    const CONTENT_TYPE = 'media';


export async function uploadMedia(req: Request, res: Response, next: NextFunction) {
    try {
        const files = req.files as Express.Multer.File[];
        const { ...mediaData } = req.body;

        if (!files || files.length === 0) {
            throw new Error('No files uploaded');
        }

        const results = await Promise.all(
            files.map(file => mediaService.uploadMedia(file, mediaData, '1sMd6-UOxEmZmq3KdP9dBcm9QMjIlhMvU'))
        );
        console.log('1sMd6-UOxEmZmq3KdP9dBcm9QMjIlhMvU', 'folderId');

        res.json({ message: 'All files uploaded successfully', count: results.length });
    } catch (error) {
        console.error('Error uploading media:', error);
        next(error);
    }
}

export async function getGalleryMedia(req: Request, res: Response, next: NextFunction) {
    try {
        const { limit, offset, filters = {} } = req.body;        
        const gallery = await mediaService.getGalleryItems(
            filters,
            limit !== undefined ? parseInt(limit) : undefined,
            offset !== undefined ? parseInt(offset) : undefined
        );
        res.json(gallery);
    } catch (error) {
        next(error);
    }
}

export async function getGalleryMediaSolider(req: Request, res: Response, next: NextFunction) {
    try {
        const { filters  } = req.body;
        const gallerySolider = await mediaService.getGalleryItems(filters);
        
        
        res.json(gallerySolider);
    } catch (error) {
        next(error);
    }
}

export async function uploadTefillinPhoto(req: Request, res: Response, next: NextFunction) {
    try {
        const files = req.files as Express.Multer.File[];
        const { id, message } = req.body;

        if (!files || files.length === 0 || !id) {
            throw new Error('Missing files or tefillinId');
        }

        await Promise.all(
            files.map(file =>
                mediaService.uploadTefillinPhoto(file, id, message)
            )
        );
        res.status(200).json({ message: 'Photos uploaded successfully', count: files.length });
    } catch (error) {
        console.error('Upload tefillin photo error:', error);
        next(error);
    }
}

export async function LoadingFiles(req: Request, res: Response, next: NextFunction) {
    try {
        const { parentFolderId, subFolderId } = req.body;
        const files = await loadingFilesFromTheDrive(parentFolderId, subFolderId);
        console.log('Files loaded from Google Drive:', files); 
        res.json(files);
    } catch (error) {
        console.error('Error loading files:', error);
        next(error);
    }
}

export const getMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await contentService.getContent(CONTENT_TYPE);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateMedia = async (req: Request, res: Response) => {
  const adminEmail = req.headers['x-admin-email'] || 'unknown';
  try {
    const result = await contentService.updateContent(CONTENT_TYPE, req.body, String(adminEmail));
    res.status(200).json(result);
  } catch (error: any) {
    console.error(`❌ Failed updating media:`, error);
    res.status(500).json({
      success: false,
      message: 'שגיאה בשמירת המדיה',
      error: error.message || String(error),
    });
  }
};

export const backupMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await contentService.backupContent(CONTENT_TYPE);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

