import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Response } from "express";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface ApiResponse<T> {
  statusCode: number;
  message?: string;
  data: T;
}

@Injectable()
export class ApiResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const _context = context.switchToHttp();
    const response = _context.getResponse<Response>();

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
