import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { ErrorHandler } from './providers/error';
import { ExpDate, JwtProvider } from './providers/jtw';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly error: ErrorHandler,
    private readonly jwt: JwtProvider,
  ) {}
  @Get('/chain-auth')
  public sanity(@Query('err') err: string): string | void {
    try {
      if (err === 'true') throw Error();
      return 'Sanity [checked]';
    } catch (err) {
      this.error.report('Sanity [unchecked]');
    }
  }
  @Get('/generate-register-code/:id')
  public sendCode(@Param('id') id: number): number | string | void {
    try {
      return this.jwt.generateRegistrationJwt(
        ExpDate.FIFTEEN_MINUTES,
        Number(id),
      );
    } catch (err) {
      this.error.report(
        'Something unexpected occurred, retry.',
        err?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
