import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import {
  FollowUserDto,
  GetFeedQueryDto,
  GetFollowersQueryDto,
  GetFollowingQueryDto,
} from "./follow.dto";
import { FollowService } from "./follow.service";

@Controller()
@UsePipes(new ValidationPipe({ whitelist: true }))
@ApiTags("Follow")
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Auth([UserRole.USER, UserRole.ADMIN])
  @ApiOperation({ summary: "Follow a user" })
  @ApiBody({ type: FollowUserDto })
  @ApiResponse({ status: 201, description: "User followed successfully" })
  async followUser(
    @Body() followUserDto: FollowUserDto,
    @AuthUser() user: User,
  ) {
    return {
      data: await this.followService.followUser(
        user._id.toString(),
        followUserDto.userId,
      ),
      message: "User followed successfully",
    };
  }

  @Delete(":userId")
  @HttpCode(HttpStatus.OK)
  @Auth([UserRole.USER, UserRole.ADMIN])
  @ApiOperation({ summary: "Unfollow a user" })
  @ApiParam({ name: "userId", description: "ID of the user to unfollow" })
  @ApiResponse({ status: 200, description: "User unfollowed successfully" })
  async unfollowUser(@Param("userId") userId: string, @AuthUser() user: User) {
    return {
      data: await this.followService.unfollowUser(user._id.toString(), userId),
      message: "User unfollowed successfully",
    };
  }

  @Get("followers/:userId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get user's followers" })
  @ApiParam({ name: "userId", description: "ID of the user" })
  @ApiQuery({ type: GetFollowersQueryDto })
  @ApiResponse({
    status: 200,
    description: "Followers retrieved successfully",
  })
  async getFollowers(
    @Param("userId") userId: string,
    @Query() query: GetFollowersQueryDto,
  ) {
    return {
      data: await this.followService.getFollowers(userId, query),
      message: "Followers retrieved successfully",
    };
  }

  @Get("following/:userId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get users that a user is following" })
  @ApiParam({ name: "userId", description: "ID of the user" })
  @ApiQuery({ type: GetFollowingQueryDto })
  @ApiResponse({
    status: 200,
    description: "Following list retrieved successfully",
  })
  async getFollowing(
    @Param("userId") userId: string,
    @Query() query: GetFollowingQueryDto,
  ) {
    return {
      data: await this.followService.getFollowing(userId, query),
      message: "Following list retrieved successfully",
    };
  }

  @Get("feed")
  @HttpCode(HttpStatus.OK)
  @Auth([UserRole.USER, UserRole.ADMIN])
  @ApiOperation({ summary: "Get user's personalized feed" })
  @ApiQuery({ type: GetFeedQueryDto })
  @ApiResponse({
    status: 200,
    description: "Feed retrieved successfully",
  })
  async getFeed(@Query() query: GetFeedQueryDto, @AuthUser() user: User) {
    return {
      data: await this.followService.getUserFeed(user._id.toString(), query),
      message: "Feed retrieved successfully",
    };
  }
}
