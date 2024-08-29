import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../providers/error';
import { AuthPrismaProvider } from '../providers/prisma';

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
    if (
      Number(req.params.id) < Number.MIN_SAFE_INTEGER ||
      Number(req.params.id) > Number.MAX_SAFE_INTEGER
    ) {
      this.error.report(
        `Paramter Id Must Be ${Number(req.params.id) < Number.MIN_SAFE_INTEGER ? 'Greater than -2^63' : 'Less than 2^63'}`,
      );
    }
    next();
  }
}

@Injectable()
export class ValidateCompanyExists implements NestMiddleware {
  constructor(
    private readonly prisma: AuthPrismaProvider,
    private readonly error: ErrorHandler,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const isValidCompany = await this.prisma.findCompanyWithId(
      Number(req.params.id),
    );
    if (!isValidCompany) {
      this.error.report(
        `Company with id: ${req.params.id} does not exist.`,
        HttpStatus.BAD_REQUEST,
      );
    }
    next();
  }
}
