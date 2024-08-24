import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { ErrorHandler } from './providers/error';
import { DecodedType, ExpDate, JwtProvider } from './providers/jtw';
import { AuthPrismaProvider } from './providers/prisma';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly error: ErrorHandler,
    private readonly jwt: JwtProvider,
    private readonly prisma: AuthPrismaProvider,
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
  public async sendCode(@Param('id') id: number) {
    try {
      //build token
      const jwt_token = this.jwt.generateRegistrationJwt(
        ExpDate.FIFTEEN_MINUTES,
        Number(id),
      );
      //grab expiration date
      const exp_date: DecodedType['exp'] = (
        await this.jwt.getExpDate(jwt_token)
      ).exp;
      const date_to_insert = new Date(exp_date * 1000);

      //validating token is not already in data base
      const isTokenNotUnique =
        await this.prisma.findRegistrationToken(jwt_token);
      if (isTokenNotUnique) {
        this.error.report(
          'Token Already Exists. Try Again Later.',
          HttpStatus.BAD_REQUEST,
        );
        //todo need to process this error better lol
        //todo may need to just replace token or whatever
        //todo dont know implications of duplicate token lol
      }

      //payload
      const payload = { token: jwt_token, expiration_date: date_to_insert };
      return (await this.prisma.addRegistrationToken(payload)).token;
    } catch (err) {
      this.error.report(
        'Something unexpected occurred, retry.',
        err?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
