import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Transform } from "class-transformer";
import { HydratedDocument, Types } from "mongoose";
import { User } from "./user.schema";

export type LikeDocument = HydratedDocument<Like>;

export enum LikeableType {
  POST = "Post",
  COMMENT = "Comment",
}

@Schema({ timestamps: true })
export class Like {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  likeable: Types.ObjectId;

  @Prop({ type: String, enum: LikeableType, required: true })
  likeableType: LikeableType;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

// Create compound index to ensure one like per user per item
LikeSchema.index({ user: 1, likeable: 1, likeableType: 1 }, { unique: true });
