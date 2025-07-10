import "fastify";
import { User } from "../database/schemas/user.schema";

declare module "fastify" {
  export interface FastifyRequest {
    user: User | undefined;
    session: string | undefined;
  }
}
