import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class GlobalLogger implements NestMiddleware {
  private readonly logger: Logger = new Logger(GlobalLogger.name);
  use(req: Request, res: Response, next: NextFunction) {
    const method: string = req.method;
    const path: string = req.baseUrl;
    const protocol: string = req.protocol;
    const timestamp: string = new Date().toISOString();
    const ip = req.socket.remoteAddress;
    const ipAddress = ip.split(' ')[0].replaceAll(',', '');
    this.logger.log(
      JSON.stringify({ method, path, protocol, timestamp, ipAddress }),
    );
    next();
  }
}
