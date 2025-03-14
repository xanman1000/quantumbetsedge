declare module 'express-rate-limit' {
  import { Request, Response, NextFunction } from 'express';

  interface Options {
    windowMs?: number;
    max?: number;
    message?: string | object;
    statusCode?: number;
    headers?: boolean;
    skipFailedRequests?: boolean;
    skipSuccessfulRequests?: boolean;
    requestPropertyName?: string;
    standardHeaders?: boolean;
    legacyHeaders?: boolean;
    store?: any;
    keyGenerator?: (req: Request) => string;
    skip?: (req: Request, res: Response) => boolean;
    handler?: (req: Request, res: Response, next: NextFunction) => void;
  }

  interface RateLimitRequestHandler {
    (req: Request, res: Response, next: NextFunction): void;
  }

  function rateLimit(options?: Options): RateLimitRequestHandler;
  
  export default rateLimit;
} 