import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { FastifyRequest } from "fastify";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    console.log("EXCEPTION", exception);

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();

    const httpAdapter = this.httpAdapterHost.httpAdapter;

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

    const responseBody = {
      success: false,
      statusCode: status,
      ...data,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
