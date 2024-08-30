import { Controller, Get, Post, Query } from '@nestjs/common';
import { AuthErrorHandler } from './providers/error';
import { JwtProvider } from './providers/jtw';
import { AuthPrismaProvider } from './providers/prisma';

//todo
//! there needs to be a guard for this entire controller that only me, my "company" can access the endpoint. it all needs to have a secret
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly error: AuthErrorHandler,
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
  @Post('/register-one')
  /**
   1. rate limit 
   2. validate 
   3. sanitize
   4. look up make sure user with email doesnot exist
   5. salt hash password 
   6. create user
   7. send verification email
   */
  public registerUser() {
    return 'hello world';
  }
}
