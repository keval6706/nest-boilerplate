import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from "@nestjs/common";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { User } from "../../database/schemas/user.schema";
import { Auth } from "../../decorators/auth.decorator";
import { AuthUser } from "../../decorators/user.decorator";
import { UserRole } from "../../enums/user.enum";
import { ValidationPipe } from "../../pipes/validation.pipe";
import { CreatePostDto, GetPostsQueryDto, UpdatePostDto } from "./post.dto";
import { PostService } from "./post.service";

@Controller()
@UsePipes(new ValidationPipe({ whitelist: true }))
@ApiTags("Posts")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Auth([UserRole.USER, UserRole.ADMIN])
  @ApiOperation({ summary: "Create a new post" })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({ status: 201, description: "Post created successfully" })
  async create(@Body() createPostDto: CreatePostDto, @AuthUser() user: User) {
    return {
      data: await this.postService.create(createPostDto, user),
      message: "Post created successfully",
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all posts with pagination and filtering" })
  @ApiQuery({
    name: "search",
    required: false,
    description: "Search in title and content",
  })
  @ApiQuery({ name: "tag", required: false, description: "Filter by tag" })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Items per page",
  })
  @ApiResponse({ status: 200, description: "Posts retrieved successfully" })
  async findAll(@Query() query: GetPostsQueryDto) {
    return {
      data: await this.postService.findAll(query),
      message: "Posts retrieved successfully",
    };
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get a single post by ID" })
  @ApiParam({ name: "id", description: "Post ID" })
  @ApiResponse({ status: 200, description: "Post retrieved successfully" })
  @ApiResponse({ status: 404, description: "Post not found" })
  async findOne(@Param("id") id: string) {
    return {
      data: await this.postService.findOne(id),
      message: "Post retrieved successfully",
    };
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @Auth([UserRole.USER, UserRole.ADMIN])
  @ApiOperation({ summary: "Update a post" })
  @ApiParam({ name: "id", description: "Post ID" })
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({ status: 200, description: "Post updated successfully" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Can only update own posts",
  })
  @ApiResponse({ status: 404, description: "Post not found" })
  async update(
    @Param("id") id: string,
    @Body() updatePostDto: UpdatePostDto,
    @AuthUser() user: User,
  ) {
    return {
      data: await this.postService.update(id, updatePostDto, user),
      message: "Post updated successfully",
    };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @Auth([UserRole.USER, UserRole.ADMIN])
  @ApiOperation({ summary: "Soft delete a post" })
  @ApiParam({ name: "id", description: "Post ID" })
  @ApiResponse({ status: 200, description: "Post deleted successfully" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Can only delete own posts",
  })
  @ApiResponse({ status: 404, description: "Post not found" })
  async remove(@Param("id") id: string, @AuthUser() user: User) {
    await this.postService.remove(id, user);
    return {
      message: "Post deleted successfully",
    };
  }
}
