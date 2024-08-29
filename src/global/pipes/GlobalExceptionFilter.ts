import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
//todo this would be a good place to gather crash analytics
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(GlobalExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    let status = exception.status;
    const exception_type = exception.name;
    let message;
    if (exception instanceof HttpException) {
      message = exception.getResponse();
    } else {
      message =
        'An unexpected problem occurred, if this problem persists, please submit a ticket.';
      status = 500;
    }
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
