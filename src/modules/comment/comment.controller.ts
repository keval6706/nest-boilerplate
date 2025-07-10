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
  UsePipes,
} from "@nestjs/common";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { User } from "../../database/schemas/user.schema";
import { Auth } from "../../decorators/auth.decorator";
import { AuthUser } from "../../decorators/user.decorator";
import { UserRole } from "../../enums/user.enum";
import { ValidationPipe } from "../../pipes/validation.pipe";
import { CreateCommentDto, UpdateCommentDto } from "./comment.dto";
import { CommentService } from "./comment.service";

@Controller()
@UsePipes(new ValidationPipe({ whitelist: true }))
@ApiTags("Comments")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Auth([UserRole.USER, UserRole.ADMIN])
  @ApiOperation({ summary: "Create a new comment" })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ status: 201, description: "Comment created successfully" })
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @AuthUser() user: User,
  ) {
    return {
      data: await this.commentService.create(
        createCommentDto,
        user._id.toString(),
      ),
      message: "Comment created successfully",
    };
  }

  @Get("post/:postId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get comments for a post" })
  @ApiParam({ name: "postId", description: "ID of the post" })
  @ApiResponse({ status: 200, description: "Comments retrieved successfully" })
  async findByPost(@Param("postId") postId: string) {
    return {
      data: await this.commentService.findByPost(postId),
      message: "Comments retrieved successfully",
    };
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get a comment by ID" })
  @ApiParam({ name: "id", description: "ID of the comment" })
  @ApiResponse({ status: 200, description: "Comment retrieved successfully" })
  async findOne(@Param("id") id: string) {
    return {
      data: await this.commentService.findById(id),
      message: "Comment retrieved successfully",
    };
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @Auth([UserRole.USER, UserRole.ADMIN])
  @ApiOperation({ summary: "Update a comment" })
  @ApiParam({ name: "id", description: "ID of the comment" })
  @ApiBody({ type: UpdateCommentDto })
  @ApiResponse({ status: 200, description: "Comment updated successfully" })
  async update(
    @Param("id") id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @AuthUser() user: User,
  ) {
    return {
      data: await this.commentService.update(
        id,
        updateCommentDto,
        user._id.toString(),
      ),
      message: "Comment updated successfully",
    };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @Auth([UserRole.USER, UserRole.ADMIN])
  @ApiOperation({ summary: "Delete a comment" })
  @ApiParam({ name: "id", description: "ID of the comment" })
  @ApiResponse({ status: 200, description: "Comment deleted successfully" })
  async remove(@Param("id") id: string, @AuthUser() user: User) {
    return await this.commentService.delete(id, user._id.toString());
  }
}
