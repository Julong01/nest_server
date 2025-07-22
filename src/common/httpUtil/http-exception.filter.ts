import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let code = '9999';
    let message = '알 수 없는 에러가 발생했습니다.';
    let status = 500;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res: any = exception.getResponse();
      if (typeof res === 'object' && res.code && res.message) {
        code = res.code;
        message = res.message;
      } else if (typeof res === 'object' && res.message) {
        message = res.message;
        code = status.toString();
      } else if (typeof res === 'string') {
        message = res;
        code = status.toString();
      }
    }

    response.status(status).json({
      code,
      message,
      data: null,
    });
  }
}
