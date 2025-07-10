import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Transform } from "class-transformer";
import { HydratedDocument, Types } from "mongoose";
import { User } from "./user.schema";

export type SessionDocument = HydratedDocument<Session>;

@Schema({ timestamps: true })
export class Session {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ type: String, required: false })
  ipAddress: string;

  @Prop({ type: String, required: true })
  refreshToken: string;

  @Prop({ type: Date, required: true })
  refreshTokenExpiresAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
