import { Express } from 'express-serve-static-core';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export {};

declare module 'express' {
  import * as expressCore from 'express-serve-static-core';
  
  // Re-export Router
  export interface Router extends expressCore.Router {}
  
  // Re-export Request
  export interface Request extends expressCore.Request {
    user?: any; // Add custom properties here
  }
  
  // Re-export Response with correctly typed methods
  export interface Response extends expressCore.Response {
    status(code: number): this;
    json(body: any): this;
    sendFile(path: string): this;
  }
  
  // Re-export NextFunction
  export type NextFunction = expressCore.NextFunction;
  
  // Re-export Express
  export interface Express extends expressCore.Express {}
  
  // Re-export Application
  export interface Application extends expressCore.Application {}
  
  // Export the express function
  export default function express(): expressCore.Express;
} 