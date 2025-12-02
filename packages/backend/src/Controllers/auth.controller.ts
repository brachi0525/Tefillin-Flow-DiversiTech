
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  static async login(req: Request, res: Response) {
    const user = req.body.user;
    const result = await AuthService.generateTokens(user);
    res.json(result);
  }

  static async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token missing' });
    }

    try {
      const newAccessToken = await AuthService.refreshAccessToken(refreshToken);
      return res.json({ accessToken: newAccessToken });
    } catch (err) {
      return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
  }
}
