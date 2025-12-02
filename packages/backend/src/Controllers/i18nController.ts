import { Request, Response, NextFunction } from 'express';
import { ContentService } from '../services/contentService';

const contentService = new ContentService();

export const getTranslations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lang } = req.params;
    const data = await contentService.getContent('i18n', lang);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateTranslations = async (req: Request, res: Response) => {
  const { lang } = req.params;
  const adminEmail = req.headers['x-admin-email'] || 'unknown';

  try {
    const result = await contentService.updateContent('i18n', req.body, String(adminEmail), lang);
    res.status(200).json(result);
  } catch (error: any) {
    console.error(`❌ Failed updating translations for ${lang}:`, error);
    res.status(500).json({
      success: false,
      message: 'שגיאה בשמירת השינויים',
      error: error.message || String(error),
    });
  }
};

export const backupTranslations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lang } = req.params;
    const result = await contentService.backupContent('i18n', lang);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
