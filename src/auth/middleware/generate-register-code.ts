import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../providers/error';

@Injectable()
export class ParseNumber implements NestMiddleware {
  constructor(private readonly error: ErrorHandler) {}
  use(req: Request, res: Response, next: NextFunction) {
    if (isNaN(Number(req.params.id))) {
      this.error.report('Parameter Id Must Be Number.', HttpStatus.BAD_REQUEST);
    }
    if (!isFinite(Number(req.params.id))) {
      this.error.report('Parameter Id Must Be Finite.', HttpStatus.BAD_REQUEST);
    }
    next();
  }
}
