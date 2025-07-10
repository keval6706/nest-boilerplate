import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  Comment,
  CommentDocument,
} from "../../database/schemas/comment.schema";
import {
  Notification,
  NotificationDocument,
  NotificationType,
} from "../../database/schemas/notification.schema";
import { Post, PostDocument } from "../../database/schemas/post.schema";
import { User, UserDocument } from "../../database/schemas/user.schema";
import { CreateNotificationDto, GetNotificationsDto } from "./notification.dto";

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    @InjectModel(Post.name)
    private postModel: Model<PostDocument>,
    @InjectModel(Comment.name)
    private commentModel: Model<CommentDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  createNotification(createDto: CreateNotificationDto): Promise<Notification> {
    const notification = new this.notificationModel({
      ...createDto,
      recipient: new Types.ObjectId(createDto.recipient),
      sender: new Types.ObjectId(createDto.sender),
      relatedEntity: createDto.relatedEntity
        ? new Types.ObjectId(createDto.relatedEntity)
        : undefined,
    });

    return notification.save();
  }

  async createLikeNotification(
    senderId: string,
    recipientId: string,
    entityId: string,
    entityType: "post" | "comment",
  ): Promise<Notification | null> {
    // Don't create notification if user likes their own content
    if (senderId === recipientId) {
      return null;
    }

    let message: string;
    let entityName: string;

    if (entityType === "post") {
      const post = await this.postModel.findById(entityId).select("title");
      if (!post) throw new NotFoundException("Post not found");
      entityName =
        post.title.length > 30
          ? `${post.title.substring(0, 30)}...`
          : post.title;
      message = `liked your post "${entityName}"`;
    } else {
      const comment = await this.commentModel
        .findById(entityId)
        .select("content");
      if (!comment) throw new NotFoundException("Comment not found");
      entityName =
        comment.content.length > 30
          ? `${comment.content.substring(0, 30)}...`
          : comment.content;
      message = `liked your comment "${entityName}"`;
    }

    const sender = await this.userModel
      .findById(senderId)
      .select("firstName lastName");
    if (!sender) throw new NotFoundException("Sender not found");

    const fullMessage = `${sender.firstName} ${sender.lastName} ${message}`;

    return this.createNotification({
      recipient: recipientId,
      sender: senderId,
      type: NotificationType.LIKE,
      message: fullMessage,
      relatedEntity: entityId,
      relatedEntityType: entityType,
    });
  }

  async createCommentNotification(
    senderId: string,
    postId: string,
  ): Promise<Notification | null> {
    const post = await this.postModel
      .findById(postId)
      .populate("author", "firstName lastName _id");
    if (!post) throw new NotFoundException("Post not found");

    const recipientId = (post.author as any)._id.toString();

    // Don't create notification if user comments on their own post
    if (senderId === recipientId) {
      return null;
    }

    const sender = await this.userModel
      .findById(senderId)
      .select("firstName lastName");
    if (!sender) throw new NotFoundException("Sender not found");

    const postTitle =
      post.title.length > 30 ? `${post.title.substring(0, 30)}...` : post.title;
    const message = `${sender.firstName} ${sender.lastName} commented on your post "${postTitle}"`;

    return this.createNotification({
      recipient: recipientId,
      sender: senderId,
      type: NotificationType.COMMENT,
      message,
      relatedEntity: postId,
      relatedEntityType: "post",
    });
  }

  async createFollowNotification(
    followerId: string,
    followingId: string,
  ): Promise<Notification | null> {
    // Don't create notification if user follows themselves (shouldn't happen)
    if (followerId === followingId) {
      return null;
    }

    const follower = await this.userModel
      .findById(followerId)
      .select("firstName lastName");
    if (!follower) throw new NotFoundException("Follower not found");

    const message = `${follower.firstName} ${follower.lastName} started following you`;

    return this.createNotification({
      recipient: followingId,
      sender: followerId,
      type: NotificationType.FOLLOW,
      message,
    });
  }

  async getUserNotifications(
    userId: string,
    query: GetNotificationsDto,
  ): Promise<{
    notifications: Notification[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = parseInt(query.page || "1");
    const limit = parseInt(query.limit || "10");
    const skip = (page - 1) * limit;

    const filter: any = {
      recipient: new Types.ObjectId(userId),
      deletedAt: null,
    };

    if (query.unreadOnly) {
      filter.isRead = false;
    }

    if (query.type) {
      filter.type = query.type;
    }

    const [notifications, total] = await Promise.all([
      this.notificationModel
        .find(filter)
        .populate("sender", "firstName lastName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.notificationModel.countDocuments(filter),
    ]);

    return {
      notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async markAsRead(
    notificationId: string,
    userId: string,
  ): Promise<Notification> {
    const notification = await this.notificationModel.findOne({
      _id: new Types.ObjectId(notificationId),
      recipient: new Types.ObjectId(userId),
    });

    if (!notification) {
      throw new NotFoundException("Notification not found");
    }

    notification.isRead = true;
    notification.readAt = new Date();

    return notification.save();
  }

  async markAllAsRead(userId: string): Promise<{ modifiedCount: number }> {
    const result = await this.notificationModel.updateMany(
      {
        recipient: new Types.ObjectId(userId),
        isRead: false,
        deletedAt: null,
      },
      {
        isRead: true,
        readAt: new Date(),
      },
    );

    return { modifiedCount: result.modifiedCount };
  }

  async deleteNotification(
    notificationId: string,
    userId: string,
  ): Promise<void> {
    const result = await this.notificationModel.updateOne(
      {
        _id: new Types.ObjectId(notificationId),
        recipient: new Types.ObjectId(userId),
      },
      {
        deletedAt: new Date(),
      },
    );

    if (result.matchedCount === 0) {
      throw new NotFoundException("Notification not found");
    }
  }

  getUnreadCount(userId: string): Promise<number> {
    return this.notificationModel.countDocuments({
      recipient: new Types.ObjectId(userId),
      isRead: false,
      deletedAt: null,
    });
  }
}
