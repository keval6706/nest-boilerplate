import "express";
import { User } from "../database/schemas/user.schema";

declare module "express" {
  export interface Request {
    user?: User;
    session?: string;
  }
}
