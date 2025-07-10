import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Follow, FollowDocument } from "../../database/schemas/follow.schema";
import { Post, PostDocument } from "../../database/schemas/post.schema";
import { User, UserDocument } from "../../database/schemas/user.schema";
import { NotificationService } from "../notification/notification.service";
import {
  GetFeedQueryDto,
  GetFollowersQueryDto,
  GetFollowingQueryDto,
} from "./follow.dto";

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(Follow.name) private followModel: Model<FollowDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private readonly notificationService: NotificationService,
  ) {}

  async followUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new NotFoundException("You cannot follow yourself");
    }

    // Check if target user exists
    const targetUser = await this.userModel.findById(followingId);
    if (!targetUser) {
      throw new NotFoundException("User not found");
    }

    try {
      const follow = new this.followModel({
        follower: new Types.ObjectId(followerId),
        following: new Types.ObjectId(followingId),
      });

      await follow.save();

      // Increment counts
      await Promise.all([
        this.userModel.findByIdAndUpdate(followerId, {
          $inc: { followingCount: 1 },
        }),
        this.userModel.findByIdAndUpdate(followingId, {
          $inc: { followersCount: 1 },
        }),
      ]);

      // Create notification for follow
      await this.notificationService.createFollowNotification(
        followerId,
        followingId,
      );

      return { message: "User followed successfully" };
    } catch (error) {
      if (error.code === 11000) {
        throw new NotFoundException("You are already following this user");
      }
      throw error;
    }
  }

  async unfollowUser(followerId: string, followingId: string) {
    const follow = await this.followModel.findOneAndDelete({
      follower: new Types.ObjectId(followerId),
      following: new Types.ObjectId(followingId),
    });

    if (!follow) {
      throw new NotFoundException("Follow relationship not found");
    }

    // Decrement counts
    await Promise.all([
      this.userModel.findByIdAndUpdate(followerId, {
        $inc: { followingCount: -1 },
      }),
      this.userModel.findByIdAndUpdate(followingId, {
        $inc: { followersCount: -1 },
      }),
    ]);

    return { message: "User unfollowed successfully" };
  }

  async getFollowers(userId: string, query: GetFollowersQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [followers, total] = await Promise.all([
      this.followModel
        .find({ following: userId })
        .populate("follower", "firstName lastName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.followModel.countDocuments({ following: userId }),
    ]);

    return {
      followers: followers.map((f) => f.follower),
      total,
      page,
      limit,
    };
  }

  async getFollowing(userId: string, query: GetFollowingQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [following, total] = await Promise.all([
      this.followModel
        .find({ follower: userId })
        .populate("following", "firstName lastName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.followModel.countDocuments({ follower: userId }),
    ]);

    return {
      following: following.map((f) => f.following),
      total,
      page,
      limit,
    };
  }

  async getUserFeed(userId: string, query: GetFeedQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // Get IDs of users that current user is following
    const followingUsers = await this.followModel
      .find({ follower: userId })
      .select("following")
      .exec();

    const followingIds = followingUsers.map((f) => f.following);

    // Include user's own posts in the feed
    followingIds.push(new Types.ObjectId(userId));

    const [posts, total] = await Promise.all([
      this.postModel
        .find({
          author: { $in: followingIds },
          deletedAt: null,
        })
        .populate("author", "firstName lastName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.postModel.countDocuments({
        author: { $in: followingIds },
        deletedAt: null,
      }),
    ]);

    return {
      posts,
      total,
      page,
      limit,
    };
  }
}
