import { Controller, Get, Query } from '@nestjs/common';
import { ErrorHandler } from './providers/error';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly error: ErrorHandler) {}
  @Get('/chain-auth')
  public sanity(@Query('err') err: string): string | void {
    try {
      if (err === 'true') throw Error();
      return 'Sanity [checked]';
    } catch (err) {
      this.error.report('Sanity [unchecked]');
    }
  }
}
