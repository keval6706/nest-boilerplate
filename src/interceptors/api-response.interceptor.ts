import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { FastifyReply } from "fastify";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface Response<T> {
  statusCode: number;
  message?: string;
  data: T;
}

@Injectable()
export class ApiResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const _context = context.switchToHttp();
    const response = _context.getResponse<FastifyReply>();

    return next.handle().pipe(
      map((data: { data: any | undefined; message: string | undefined }) => ({
        success: true,
        statusCode: response.statusCode,
        message: data?.message,
        data: data?.data,
      })),
    );
  }
}
