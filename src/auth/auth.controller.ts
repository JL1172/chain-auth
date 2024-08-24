import { Controller, Get } from '@nestjs/common';
import { ErrorHandler } from './providers/error';

@Controller()
export class AuthenticationController {
  constructor(private readonly error: ErrorHandler) {}
  @Get('/chain-auth')
  public sanity(): string {
    try {
      return 'Sanity [checked]';
    } catch (err) {
      this.error.report('Sanity [unchecked]');
    }
  }
}
