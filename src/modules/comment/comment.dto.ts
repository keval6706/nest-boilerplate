import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
  @ApiProperty({ description: "Content of the comment" })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: "ID of the post to comment on" })
  @IsNotEmpty()
  @IsMongoId()
  postId: string;
}

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @ApiPropertyOptional({ description: "Updated content of the comment" })
  @IsOptional()
  @IsString()
  content?: string;
}

export class GetCommentsQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;
}
