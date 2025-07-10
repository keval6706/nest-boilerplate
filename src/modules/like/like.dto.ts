import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty } from "class-validator";

export class LikePostDto {
  @ApiProperty({ description: "ID of the post to like" })
  @IsNotEmpty()
  @IsMongoId()
  postId: string;
}

export class LikeCommentDto {
  @ApiProperty({ description: "ID of the comment to like" })
  @IsNotEmpty()
  @IsMongoId()
  commentId: string;
}
