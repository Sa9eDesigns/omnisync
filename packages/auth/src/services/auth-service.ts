import { userQueries, userMutations } from '@boilerplate/database';
import { TokenService } from './token-service';
import { PasswordService } from './password-service';
import type {
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
  AuthResponse,
  AuthError,
  AuthErrorCode,
} from '../types';

export class AuthService {
  private tokenService = new TokenService();
  private passwordService = new PasswordService();

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = await userQueries.findByEmail(credentials.email);
      if (!user) {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      }

      // Verify password
      const isValidPassword = await this.passwordService.verify(
        credentials.password,
        user.password || ''
      );

      if (!isValidPassword) {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      }

      // Generate tokens
      const token = this.tokenService.generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      const refreshToken = this.tokenService.generateRefreshToken({
        userId: user.id,
      });

      // Update last login
      await userMutations.update(user.id, {
        lastLoginAt: new Date(),
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      return {
        success: true,
        user: userWithoutPassword,
        token,
        refreshToken,
        message: 'Login successful',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'An error occurred during login',
      };
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await userQueries.findByEmail(data.email);
      if (existingUser) {
        return {
          success: false,
          error: 'An account with this email already exists',
        };
      }

      // Hash password
      const hashedPassword = await this.passwordService.hash(data.password);

      // Create user
      const user = await userMutations.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: 'USER',
        emailVerified: false,
      });

      // Generate tokens
      const token = this.tokenService.generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      const refreshToken = this.tokenService.generateRefreshToken({
        userId: user.id,
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      return {
        success: true,
        user: userWithoutPassword,
        token,
        refreshToken,
        message: 'Registration successful',
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'An error occurred during registration',
      };
    }
  }

  async forgotPassword(data: ForgotPasswordData): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = await userQueries.findByEmail(data.email);
      if (!user) {
        // Don't reveal if email exists for security
        return {
          success: true,
          message: 'If an account with this email exists, a reset link has been sent',
        };
      }

      // Generate reset token
      const resetToken = this.tokenService.generatePasswordResetToken({
        userId: user.id,
        email: user.email,
      });

      // Store reset token (in production, store in database)
      // For now, we'll just log it
      console.log('Password reset token:', resetToken);

      // TODO: Send email with reset link
      // await emailService.sendPasswordResetEmail(user.email, resetToken);

      return {
        success: true,
        message: 'If an account with this email exists, a reset link has been sent',
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        error: 'An error occurred while processing your request',
      };
    }
  }

  async resetPassword(data: ResetPasswordData): Promise<AuthResponse> {
    try {
      // Verify reset token
      const payload = this.tokenService.verifyPasswordResetToken(data.token);
      if (!payload) {
        return {
          success: false,
          error: 'Invalid or expired reset token',
        };
      }

      // Find user
      const user = await userQueries.findById(payload.userId);
      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      // Hash new password
      const hashedPassword = await this.passwordService.hash(data.password);

      // Update password
      await userMutations.update(user.id, {
        password: hashedPassword,
        passwordChangedAt: new Date(),
      });

      return {
        success: true,
        message: 'Password reset successful',
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: 'An error occurred while resetting your password',
      };
    }
  }

  async changePassword(userId: string, data: ChangePasswordData): Promise<AuthResponse> {
    try {
      // Find user
      const user = await userQueries.findById(userId);
      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      // Verify current password
      const isValidPassword = await this.passwordService.verify(
        data.currentPassword,
        user.password || ''
      );

      if (!isValidPassword) {
        return {
          success: false,
          error: 'Current password is incorrect',
        };
      }

      // Hash new password
      const hashedPassword = await this.passwordService.hash(data.newPassword);

      // Update password
      await userMutations.update(user.id, {
        password: hashedPassword,
        passwordChangedAt: new Date(),
      });

      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: 'An error occurred while changing your password',
      };
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      // Verify refresh token
      const payload = this.tokenService.verifyRefreshToken(refreshToken);
      if (!payload) {
        return {
          success: false,
          error: 'Invalid refresh token',
        };
      }

      // Find user
      const user = await userQueries.findById(payload.userId);
      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      // Generate new access token
      const newToken = this.tokenService.generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      return {
        success: true,
        user: userWithoutPassword,
        token: newToken,
        message: 'Token refreshed successfully',
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      return {
        success: false,
        error: 'An error occurred while refreshing token',
      };
    }
  }

  async validateToken(token: string): Promise<{ isValid: boolean; userId?: string }> {
    try {
      const payload = this.tokenService.verifyAccessToken(token);
      if (!payload) {
        return { isValid: false };
      }

      return {
        isValid: true,
        userId: payload.userId,
      };
    } catch (error) {
      return { isValid: false };
    }
  }
}
