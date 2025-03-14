import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// JWT secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Define custom request interface with user property
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Middleware to authenticate JWT tokens
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided'
    });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user info to request
    (req as any).user = decoded;
    
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

/**
 * Middleware to verify admin role
 */
export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // First check if user is authenticated
  authMiddleware(req, res, () => {
    // Check if user has admin role
    if ((req as any).user && (req as any).user.role === 'admin') {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required'
      });
    }
  });
};

export default {
  authMiddleware,
  adminMiddleware
}; 