import { Request, Response } from 'express';
import { googleAuthService } from '../../services/authToken/googleToken.service';

export class GoogleRefreshController {
  static async handleRefresh(req: Request, res: Response) {
    try {
      const { google_id } = req.body;
      if (!google_id) {
        return res.status(400).json({ message: 'Missing google_id' });
      }

      const newTokens = await googleAuthService.refreshAccessToken(google_id);
      return res.status(200).json(newTokens);
    } catch (error: any) {
      console.error('Google token refresh failed:', error);
      return res.status(500).json({
        message: 'Failed to refresh Google access token',
        error: error.message,
      });
    }
  }
}
