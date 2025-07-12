import jwt from 'jsonwebtoken';
import type { TokenPayload } from '../types';

interface AccessTokenPayload {
  userId: string;
  email: string;
  role: string;
}

interface RefreshTokenPayload {
  userId: string;
}

interface PasswordResetTokenPayload {
  userId: string;
  email: string;
}

export class TokenService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly passwordResetSecret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;
  private readonly passwordResetExpiry: string;

  constructor() {
    // In production, these should come from environment variables
    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'your-access-token-secret';
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'your-refresh-token-secret';
    this.passwordResetSecret = process.env.JWT_RESET_SECRET || 'your-reset-token-secret';
    this.accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';
    this.passwordResetExpiry = process.env.JWT_RESET_EXPIRY || '1h';
  }

  generateAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
      issuer: 'boilerplate-app',
      audience: 'boilerplate-users',
    });
  }

  generateRefreshToken(payload: RefreshTokenPayload): string {
    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
      issuer: 'boilerplate-app',
      audience: 'boilerplate-users',
    });
  }

  generatePasswordResetToken(payload: PasswordResetTokenPayload): string {
    return jwt.sign(payload, this.passwordResetSecret, {
      expiresIn: this.passwordResetExpiry,
      issuer: 'boilerplate-app',
      audience: 'boilerplate-users',
    });
  }

  verifyAccessToken(token: string): TokenPayload | null {
    try {
      const payload = jwt.verify(token, this.accessTokenSecret, {
        issuer: 'boilerplate-app',
        audience: 'boilerplate-users',
      }) as TokenPayload;
      return payload;
    } catch (error) {
      console.error('Access token verification failed:', error);
      return null;
    }
  }

  verifyRefreshToken(token: string): RefreshTokenPayload | null {
    try {
      const payload = jwt.verify(token, this.refreshTokenSecret, {
        issuer: 'boilerplate-app',
        audience: 'boilerplate-users',
      }) as RefreshTokenPayload;
      return payload;
    } catch (error) {
      console.error('Refresh token verification failed:', error);
      return null;
    }
  }

  verifyPasswordResetToken(token: string): PasswordResetTokenPayload | null {
    try {
      const payload = jwt.verify(token, this.passwordResetSecret, {
        issuer: 'boilerplate-app',
        audience: 'boilerplate-users',
      }) as PasswordResetTokenPayload;
      return payload;
    } catch (error) {
      console.error('Password reset token verification failed:', error);
      return null;
    }
  }

  decodeToken(token: string): any {
    try {
      return jwt.decode(token);
    } catch (error) {
      console.error('Token decode failed:', error);
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as any;
      if (!decoded || !decoded.exp) {
        return true;
      }
      
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  getTokenExpiry(token: string): Date | null {
    try {
      const decoded = jwt.decode(token) as any;
      if (!decoded || !decoded.exp) {
        return null;
      }
      
      return new Date(decoded.exp * 1000);
    } catch (error) {
      return null;
    }
  }

  getTokenTimeRemaining(token: string): number {
    try {
      const expiry = this.getTokenExpiry(token);
      if (!expiry) {
        return 0;
      }
      
      const now = new Date();
      const timeRemaining = expiry.getTime() - now.getTime();
      return Math.max(0, timeRemaining);
    } catch (error) {
      return 0;
    }
  }

  shouldRefreshToken(token: string, bufferTime: number = 5 * 60 * 1000): boolean {
    const timeRemaining = this.getTokenTimeRemaining(token);
    return timeRemaining <= bufferTime;
  }
}
