import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AuthErrorHandler {
  public report(
    err: string | Record<string, any>,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ): void {
    this.propagateError(err, status);
  }
  private propagateError(
    err: string | Record<string, any>,
    status: HttpStatus,
  ) {
    throw new HttpException(err, status);
  }
}
