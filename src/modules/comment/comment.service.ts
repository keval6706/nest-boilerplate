import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  Comment,
  CommentDocument,
} from "../../database/schemas/comment.schema";
import { Post, PostDocument } from "../../database/schemas/post.schema";
import { NotificationService } from "../notification/notification.service";
import { CreateCommentDto, UpdateCommentDto } from "./comment.dto";

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private readonly notificationService: NotificationService,
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: string) {
    const { content, postId } = createCommentDto;

    // Check if post exists
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new NotFoundException("Post not found");
    }

    const comment = new this.commentModel({
      content,
      post: new Types.ObjectId(postId),
      author: new Types.ObjectId(userId),
    });

    const savedComment = await comment.save();

    // Increment comments count on post
    await this.postModel.findByIdAndUpdate(postId, {
      $inc: { commentsCount: 1 },
    });

    // Create notification for comment
    await this.notificationService.createCommentNotification(userId, postId);

    return savedComment.populate("author", "firstName lastName email");
  }

  findByPost(postId: string) {
    return this.commentModel
      .find({ post: postId, deletedAt: null })
      .populate("author", "firstName lastName email")
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string) {
    const comment = await this.commentModel
      .findById(id)
      .populate("author", "firstName lastName email")
      .exec();

    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string) {
    const comment = await this.commentModel.findById(id);
    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    if (comment.author.toString() !== userId) {
      throw new NotFoundException("You can only update your own comments");
    }

    const updatedComment = await this.commentModel
      .findByIdAndUpdate(id, updateCommentDto, { new: true })
      .populate("author", "firstName lastName email")
      .exec();

    return updatedComment;
  }

  async delete(id: string, userId: string) {
    const comment = await this.commentModel.findById(id);
    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    if (comment.author.toString() !== userId) {
      throw new NotFoundException("You can only delete your own comments");
    }

    await this.commentModel.findByIdAndUpdate(id, { deletedAt: new Date() });

    // Decrement comments count on post
    await this.postModel.findByIdAndUpdate(comment.post, {
      $inc: { commentsCount: -1 },
    });

    return { message: "Comment deleted successfully" };
  }
}
