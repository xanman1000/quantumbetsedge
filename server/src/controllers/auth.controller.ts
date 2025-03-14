import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Admin from '../models/admin.model';
import { AuthRequest } from '../middleware/auth.middleware';

// JWT secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default_refresh_secret';

/**
 * Auth Controller - Handles admin authentication
 */
const authController = {
  /**
   * Login an admin user
   */
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      
      // Find admin by email
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Check if admin is active
      if (!admin.isActive) {
        return res.status(403).json({ message: 'Account is inactive. Please contact support.' });
      }
      
      // Check password
      const isPasswordValid = await admin.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Update last login time
      admin.lastLogin = new Date();
      await admin.save();
      
      // Generate tokens
      const accessToken = jwt.sign(
        { id: admin._id, email: admin.email, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      const refreshToken = jwt.sign(
        { id: admin._id, email: admin.email, role: 'admin' },
        JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );
      
      // Send response
      res.status(200).json({
        message: 'Login successful',
        data: {
          admin: {
            id: admin._id,
            email: admin.email,
            firstName: admin.firstName,
            lastName: admin.lastName,
          },
          accessToken,
          refreshToken,
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error: (error as Error).message });
    }
  },
  
  /**
   * Logout an admin user
   */
  logout: async (req: Request, res: Response) => {
    try {
      // In a real implementation, you might want to invalidate the token
      // by adding it to a blacklist or using Redis to store invalidated tokens
      
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      res.status(500).json({ message: 'Logout failed', error: (error as Error).message });
    }
  },
  
  /**
   * Refresh the access token using a refresh token
   */
  refreshToken: async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' });
      }
      
      try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
          id: string;
          email: string;
          role: string;
        };
        
        // Check if admin exists
        const admin = await Admin.findById(decoded.id);
        if (!admin) {
          return res.status(401).json({ message: 'Invalid token' });
        }
        
        // Generate new access token
        const accessToken = jwt.sign(
          { id: admin._id, email: admin.email, role: 'admin' },
          JWT_SECRET,
          { expiresIn: '1h' }
        );
        
        // Send response
        res.status(200).json({
          message: 'Token refreshed successfully',
          data: { accessToken }
        });
      } catch (error) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Token refresh failed', error: (error as Error).message });
    }
  },
  
  /**
   * Forgot password - Send password reset email
   */
  forgotPassword: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
      
      // Find admin by email
      const admin = await Admin.findOne({ email });
      if (!admin) {
        // For security reasons, don't reveal that the email doesn't exist
        return res.status(200).json({ message: 'If the email exists, a reset link has been sent' });
      }
      
      // Generate reset token (normally would send via email)
      const resetToken = crypto.randomBytes(32).toString('hex');
      
      // In a real implementation, you would:
      // 1. Hash the token and store it in the database
      // 2. Set an expiration date
      // 3. Send an email with a link containing the token
      
      res.status(200).json({
        message: 'If the email exists, a reset link has been sent',
        // For development purposes only, include the token in the response
        devToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
      });
    } catch (error) {
      res.status(500).json({ message: 'Password reset request failed', error: (error as Error).message });
    }
  },
  
  /**
   * Reset password using token
   */
  resetPassword: async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({ message: 'New password is required' });
      }
      
      // In a real implementation, you would:
      // 1. Find the admin with the matching reset token
      // 2. Check if the token is expired
      // 3. Update the password and clear the reset token
      
      // For this placeholder, we'll just return a success message
      res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Password reset failed', error: (error as Error).message });
    }
  },
  
  /**
   * Get admin profile
   */
  getProfile: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const admin = await Admin.findById(req.user.id).select('-password');
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      
      res.status(200).json({
        message: 'Profile retrieved successfully',
        data: admin
      });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving profile', error: (error as Error).message });
    }
  },
  
  /**
   * Update admin profile
   */
  updateProfile: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { firstName, lastName } = req.body;
      
      const admin = await Admin.findById(req.user.id);
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      
      // Update fields
      if (firstName) admin.firstName = firstName;
      if (lastName) admin.lastName = lastName;
      
      // Save changes
      await admin.save();
      
      res.status(200).json({
        message: 'Profile updated successfully',
        data: {
          id: admin._id,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile', error: (error as Error).message });
    }
  },
  
  /**
   * Change admin password
   */
  changePassword: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current password and new password are required' });
      }
      
      const admin = await Admin.findById(req.user.id);
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      
      // Verify current password
      const isPasswordValid = await admin.comparePassword(currentPassword);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
      
      // Update password
      admin.password = newPassword;
      await admin.save();
      
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error changing password', error: (error as Error).message });
    }
  },
};

export default authController; 