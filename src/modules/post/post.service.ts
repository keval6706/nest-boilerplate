import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Post, PostDocument } from "../../database/schemas/post.schema";
import { User } from "../../database/schemas/user.schema";
import { UserRole } from "../../enums/user.enum";
import { CreatePostDto, GetPostsQueryDto, UpdatePostDto } from "./post.dto";

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(createPostDto: CreatePostDto, author: User): Promise<Post> {
    const post = new this.postModel({
      ...createPostDto,
      author: author._id,
    });
    return await post.save();
  }

  async findAll(
    query: GetPostsQueryDto,
  ): Promise<{ posts: Post[]; total: number; page: number; limit: number }> {
    const { search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const filter: any = { deletedAt: null, isActive: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const [posts, total] = await Promise.all([
      this.postModel
        .find(filter)
        .populate("author", "firstName lastName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.postModel.countDocuments(filter),
    ]);

    return {
      posts,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Post> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Post not found");
    }

    const post = await this.postModel
      .findOne({ _id: id, deletedAt: null, isActive: true })
      .populate("author", "firstName lastName email")
      .exec();

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    return post;
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    user: User,
  ): Promise<Post> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Post not found");
    }

    const post = await this.postModel
      .findOne({ _id: id, deletedAt: null })
      .exec();

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    if (
      post.author.toString() !== user._id.toString() &&
      user.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException("You can only update your own posts");
    }

    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, { ...updatePostDto }, { new: true })
      .populate("author", "firstName lastName email")
      .exec();

    return updatedPost;
  }

  async remove(id: string, user: User): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Post not found");
    }

    const post = await this.postModel
      .findOne({ _id: id, deletedAt: null })
      .exec();

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    // Check if user is the author or admin
    if (
      post.author.toString() !== user._id.toString() &&
      user.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException("You can only delete your own posts");
    }

    await this.postModel
      .findByIdAndUpdate(id, { deletedAt: new Date() })
      .exec();
  }
}
