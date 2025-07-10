import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.log("EXCEPTION", exception);

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status: number =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const data: any =
      exception instanceof HttpException
        ? typeof exception.getResponse() === "string"
          ? { message: exception.getResponse() }
          : {
              message: (exception.getResponse() as any).message,
              errors: (exception.getResponse() as any).errors,
            }
        : {
            message: "Sorry, something went wrong there. Try again.",
          };

    response.status(status).json({
      success: false,
      statusCode: status,
      ...data,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
