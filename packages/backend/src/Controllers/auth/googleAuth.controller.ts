import { Request, Response } from 'express';
import { googleAuthService } from '../../services/authToken/googleToken.service';
import { AuthService } from '../../services/auth.service';
import { UserStatus } from '../../../../../types';
export class GoogleAuthController {
  static async handleGoogleAuth(req: Request, res: Response) {
    try {
      const { code, redirectUri } = req.body;

      if (!code || !redirectUri) {
        return res.status(400).json({ error: 'Missing code or redirectUri' });
      }

      const result = await googleAuthService.exchangeCodeAndGetUser(code, redirectUri);

      if (!result || !result.user || !result.user.id || !result.user.email || !result.user.role) {
        return res.status(401).json({ error: 'Invalid Google authentication or user data incomplete' });
      }


      const internalTokens = await AuthService.generateTokens({
        id: result.user.id!,
        email: result.user.email!,
        name: result.user.name ?? '',
        role: result.user.role!,
        status: result.user.status ?? UserStatus.ACTIVE // ✅ טיפול ב-undefined
      });

console.log({googleAccessToken: result.access_token,
        googleRefreshToken: result.refresh_token,
        internalAccessToken: internalTokens.accessToken,
        internalRefreshToken: internalTokens.refreshToken,
        user: result.user})
      return res.json({
        googleAccessToken: result.access_token,
        googleRefreshToken: result.refresh_token,
        internalAccessToken: internalTokens.accessToken,
        internalRefreshToken: internalTokens.refreshToken,
        user: result.user
      });

    } catch (error: any) {
      console.error('GoogleAuthController error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
