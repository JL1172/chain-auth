import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as rl from 'express-rate-limit';
import { AuthErrorHandler } from '../providers/error';
import { AuthPrismaProvider } from '../providers/prisma';
import { Delay } from '../providers/delay';

//todo need to fix all of this badly need to understand what the hell i am doing
//todo this logic sucks, need to fix.
@Injectable()
export class RateLimit implements NestMiddleware {
  constructor(
    private readonly error: AuthErrorHandler,
    private readonly prisma: AuthPrismaProvider,
  ) {}
  private propagated_error;
  private readonly ratelimit = rl.rateLimit({
    //todo need to fix this
    limit: 2,
    windowMs: 15 * 60 * 1000,
    handler: (req: Request) => {
      const ip = req.socket.remoteAddress;
      const ipAddress = ip.split(' ')[0].replaceAll(',', '');
      this.prisma.addIpViolationToWatchList(ipAddress).then((res) => {
        // console.log(res);
        if (res.blacklisted === true) {
          this.propagated_error = 'Cannot Process Request.';
        } else {
          this.propagated_error = 'Too Many Requests.';
        }
      });
      console.log(this.propagated_error);
      this.error.report(
        this.propagated_error,
        this.propagated_error === 'Too Many Requests.'
          ? HttpStatus.TOO_MANY_REQUESTS
          : HttpStatus.BAD_REQUEST,
      );
    },
  });
  use(req: Request, res: Response, next: NextFunction) {
    this.ratelimit(req, res, next);
  }
}

@Injectable()
export class ValidateIpIsNotBlacklisted implements NestMiddleware {
  constructor(
    private readonly prisma: AuthPrismaProvider,
    private readonly error: AuthErrorHandler,
    private readonly delay: Delay,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    await this.delay.delay(100);
    const ip = req.socket.remoteAddress;
    const ipAddress = ip.split(' ')[0].replaceAll(',', '');
    const isIpBlacklisted: boolean =
      await this.prisma.validateIpIsNotBlacklisted(ipAddress);
    if (isIpBlacklisted) {
      this.error.report('Cannot Process Request.', HttpStatus.BAD_REQUEST);
    } else {
      next();
    }
  }
}
