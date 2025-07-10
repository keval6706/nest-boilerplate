import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Transform } from "class-transformer";
import { HydratedDocument, Types } from "mongoose";
import { User } from "./user.schema";

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: false })
  imageUrl?: string;

  @Prop({ required: false })
  videoUrl?: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  author: Types.ObjectId;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
