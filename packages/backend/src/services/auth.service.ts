import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken
} from '../utils/jwt.util';

import { TokenResponseDto } from '../dto/token.dto';
import { UserRepository } from '../repositories/userRepository';
import { User } from '../../../../types/users';

export class AuthService {
  static async generateTokens(user: User): Promise<TokenResponseDto> {
    const accessToken = createAccessToken({
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name
    });

    const refreshToken = createRefreshToken({ id: user.id });

    const repo = new UserRepository();
    await repo.update(user.id, {
  internal_refresh_token: refreshToken,
  internal_access_token: accessToken,
});

  

    return { accessToken, refreshToken };
  }


  static async refreshAccessToken(refreshToken: string): Promise<string> {
    console.log('🔁 STEP 1 - Received refreshToken:', refreshToken);

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken) as { id: string };
      console.log('🔁 STEP 2 - Decoded payload:', payload);
    } catch (err) {
      console.error('❌ Token verification failed:');
      throw new Error('Token verification failed');
    }

    const repo = new UserRepository();
    const user = await repo.getById(payload.id);

    console.log('🔁 STEP 3 - User found:', !!user);
    console.log('🔁 STEP 4 - Stored token in user:', user?.internal_refresh_token);
    console.log('🔁 STEP 5 - Match:', user?.internal_refresh_token === refreshToken);

    if (!user || user.internal_refresh_token !== refreshToken) {
      throw new Error('Invalid or mismatched refresh token');
    }

    const newAccessToken = createAccessToken({
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name
    });

    await repo.update(user.id, {
      internal_access_token: newAccessToken
    });

    return newAccessToken;
  }
}
