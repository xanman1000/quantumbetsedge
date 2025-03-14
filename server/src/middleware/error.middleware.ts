import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.config';

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(`Error: ${err.message}`);
  
  if (err.stack) {
    logger.error(err.stack);
  }

  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
  });
};

/**
 * Not found middleware for handling 404 errors
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
};

export default {
  errorHandler,
  notFoundHandler
}; 