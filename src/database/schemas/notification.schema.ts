import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Transform } from "class-transformer";
import { HydratedDocument, Types } from "mongoose";
import { User } from "./user.schema";

export type NotificationDocument = HydratedDocument<Notification>;

export enum NotificationType {
  LIKE = "like",
  COMMENT = "comment",
  FOLLOW = "follow",
}

@Schema({ timestamps: true })
export class Notification {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  recipient: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  sender: Types.ObjectId;

  @Prop({ type: String, enum: NotificationType, required: true })
  type: NotificationType;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Types.ObjectId, required: false })
  relatedEntity: Types.ObjectId;

  @Prop({ type: String, required: false })
  relatedEntityType: string;

  @Prop({ type: Boolean, default: false })
  isRead: boolean;

  @Prop({ type: Date, default: null })
  readAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Create index for efficient querying
NotificationSchema.index({ recipient: 1, createdAt: -1 });
NotificationSchema.index({ recipient: 1, isRead: 1 });
