import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
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
import { LikeCommentDto, LikePostDto } from "./like.dto";
import { LikeService } from "./like.service";

@Controller("likes")
@UsePipes(new ValidationPipe({ whitelist: true }))
@ApiTags("Likes")
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post("post")
  @HttpCode(HttpStatus.CREATED)
  @Auth([UserRole.USER, UserRole.ADMIN])
  @ApiOperation({ summary: "Like a post" })
  @ApiBody({ type: LikePostDto })
  @ApiResponse({ status: 201, description: "Post liked successfully" })
  async likePost(@Body() likePostDto: LikePostDto, @AuthUser() user: User) {
    return {
      data: await this.likeService.likePost(
        likePostDto.postId,
        user._id.toString(),
      ),
      message: "Post liked successfully",
    };
  }

  @Delete("post/:postId")
  @HttpCode(HttpStatus.OK)
  @Auth([UserRole.USER, UserRole.ADMIN])
  @ApiOperation({ summary: "Unlike a post" })
  @ApiParam({ name: "postId", description: "ID of the post to unlike" })
  @ApiResponse({ status: 200, description: "Post unliked successfully" })
  async unlikePost(@Param("postId") postId: string, @AuthUser() user: User) {
    return {
      data: await this.likeService.unlikePost(postId, user._id.toString()),
      message: "Post unliked successfully",
    };
  }

  @Post("comment")
  @HttpCode(HttpStatus.CREATED)
  @Auth([UserRole.USER, UserRole.ADMIN])
  @ApiOperation({ summary: "Like a comment" })
  @ApiBody({ type: LikeCommentDto })
  @ApiResponse({ status: 201, description: "Comment liked successfully" })
  async likeComment(
    @Body() likeCommentDto: LikeCommentDto,
    @AuthUser() user: User,
  ) {
    return {
      data: await this.likeService.likeComment(
        likeCommentDto.commentId,
        user._id.toString(),
      ),
      message: "Comment liked successfully",
    };
  }

  @Delete("comment/:commentId")
  @HttpCode(HttpStatus.OK)
  @Auth([UserRole.USER, UserRole.ADMIN])
  @ApiOperation({ summary: "Unlike a comment" })
  @ApiParam({ name: "commentId", description: "ID of the comment to unlike" })
  @ApiResponse({ status: 200, description: "Comment unliked successfully" })
  async unlikeComment(
    @Param("commentId") commentId: string,
    @AuthUser() user: User,
  ) {
    return {
      data: await this.likeService.unlikeComment(
        commentId,
        user._id.toString(),
      ),
      message: "Comment unliked successfully",
    };
  }
}
