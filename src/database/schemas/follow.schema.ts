import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Transform } from "class-transformer";
import { HydratedDocument, Types } from "mongoose";
import { User } from "./user.schema";

export type FollowDocument = HydratedDocument<Follow>;

@Schema({ timestamps: true })
export class Follow {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  follower: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  following: Types.ObjectId;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);

// Create compound index to ensure one follow relationship per user pair
FollowSchema.index({ follower: 1, following: 1 }, { unique: true });
