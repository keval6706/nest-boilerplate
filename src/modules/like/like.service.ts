import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  Comment,
  CommentDocument,
} from "../../database/schemas/comment.schema";
import {
  Like,
  LikeDocument,
  LikeableType,
} from "../../database/schemas/like.schema";
import { Post, PostDocument } from "../../database/schemas/post.schema";

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async likePost(postId: string, userId: string) {
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new NotFoundException("Post not found");
    }

    try {
      const like = new this.likeModel({
        user: new Types.ObjectId(userId),
        likeable: new Types.ObjectId(postId),
        likeableType: LikeableType.POST,
      });

      await like.save();

      await this.postModel.findByIdAndUpdate(postId, {
        $inc: { likesCount: 1 },
      });

      return { message: "Post liked successfully" };
    } catch (error) {
      if (error.code === 11000) {
        throw new NotFoundException("You have already liked this post");
      }
      throw error;
    }
  }

  async unlikePost(postId: string, userId: string) {
    const like = await this.likeModel.findOneAndDelete({
      user: new Types.ObjectId(userId),
      likeable: new Types.ObjectId(postId),
      likeableType: LikeableType.POST,
    });

    if (!like) {
      throw new NotFoundException("Like not found");
    }

    await this.postModel.findByIdAndUpdate(postId, {
      $inc: { likesCount: -1 },
    });

    return { message: "Post unliked successfully" };
  }

  async likeComment(commentId: string, userId: string) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    try {
      const like = new this.likeModel({
        user: new Types.ObjectId(userId),
        likeable: new Types.ObjectId(commentId),
        likeableType: LikeableType.COMMENT,
      });

      await like.save();

      await this.commentModel.findByIdAndUpdate(commentId, {
        $inc: { likesCount: 1 },
      });

      return { message: "Comment liked successfully" };
    } catch (error) {
      if (error.code === 11000) {
        throw new NotFoundException("You have already liked this comment");
      }
      throw error;
    }
  }

  async unlikeComment(commentId: string, userId: string) {
    const like = await this.likeModel.findOneAndDelete({
      user: new Types.ObjectId(userId),
      likeable: new Types.ObjectId(commentId),
      likeableType: LikeableType.COMMENT,
    });

    if (!like) {
      throw new NotFoundException("Like not found");
    }

    await this.commentModel.findByIdAndUpdate(commentId, {
      $inc: { likesCount: -1 },
    });

    return { message: "Comment unliked successfully" };
  }
}
