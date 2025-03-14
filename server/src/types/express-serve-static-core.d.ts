declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
    body: any;
    params: any;
    query: any;
    headers: any;
    originalUrl: string;
    path: string;
    method: string;
  }

  interface Response {
    status(code: number): this;
    json(body: any): this;
    send(body: any): this;
    sendFile(path: string): this;
    cookie(name: string, value: string, options?: any): this;
    clearCookie(name: string, options?: any): this;
    redirect(url: string): this;
    redirect(status: number, url: string): this;
    render(view: string, options?: any): this;
  }

  interface NextFunction {
    (err?: any): void;
  }

  interface Express {
    request: Request;
    response: Response;
  }

  interface Router {
    get(path: string, ...handlers: any[]): this;
    post(path: string, ...handlers: any[]): this;
    put(path: string, ...handlers: any[]): this;
    delete(path: string, ...handlers: any[]): this;
    patch(path: string, ...handlers: any[]): this;
    use(...handlers: any[]): this;
    use(path: string, ...handlers: any[]): this;
    route(path: string): this;
  }

  interface Application {
    use(handler: any): this;
    use(path: string, handler: any): this;
    get(path: string, ...handlers: any[]): this;
    post(path: string, ...handlers: any[]): this;
    put(path: string, ...handlers: any[]): this;
    delete(path: string, ...handlers: any[]): this;
    patch(path: string, ...handlers: any[]): this;
    listen(port: number, callback?: () => void): any;
    set(setting: string, value: any): this;
  }
} 