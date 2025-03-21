import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { FastifyRequest } from 'fastify';

@Injectable()
export class AuthUser {
  constructor(@Inject(REQUEST) private readonly request: FastifyRequest) {}

  get user() {
    return this.request.user;
  }

  get session() {
    return this.request.session;
  }
}
