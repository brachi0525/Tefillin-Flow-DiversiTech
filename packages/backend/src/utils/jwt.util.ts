import jwt from 'jsonwebtoken';


const accessSecret = process.env.JWT_ACCESS_SECRET!;
const refreshSecret = process.env.JWT_REFRESH_SECRET!;
const accessExpiresIn = '15m';
const refreshExpiresIn = '7d';

export function createAccessToken(payload: object): string {
  return jwt.sign(payload, accessSecret, {
    algorithm: 'HS256',
    expiresIn: accessExpiresIn,
  });
}

export function createRefreshToken(payload: object): string {
  return jwt.sign(payload, refreshSecret, {
    algorithm: 'HS256',
    expiresIn: refreshExpiresIn,
  });
}

export function verifyAccessToken(token: string): any {
  return jwt.verify(token, accessSecret);
}

export function verifyRefreshToken(token: string): any {
  return jwt.verify(token, refreshSecret);
}