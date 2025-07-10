import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Transform } from "class-transformer";
import { HydratedDocument, Types } from "mongoose";
import { Post } from "./post.schema";
import { User } from "./user.schema";

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  author: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Post.name, required: true })
  post: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  likesCount: number;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
