import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(GlobalExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.status;
    const exception_type = exception.name;
    const message =
      exception?.getResponse() || 'An Unexpected Problem Occurred';
    const timestamp = new Date().toISOString();
    const { baseUrl, method } = req;
    this.logger.error(
      JSON.stringify({
        status,
        exception_type,
        message,
        timestamp,
        baseUrl,
        method,
      }),
    );
    res.status(status).json({
      status,
      message,
      timestamp,
      method,
    });
  }
}
