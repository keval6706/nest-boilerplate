import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!user) {
      throw new Error("User not found in request");
    }

    return user;
  },
);

export const AuthSession = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const session = request.session;

    if (!session) {
      throw new Error("Session not found in request");
    }

    return session;
  },
);
