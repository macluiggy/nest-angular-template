import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'This is a comment' })
  @IsNotEmpty({
    message: 'Please enter a comment',
  })
  @IsString()
  content: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  postId: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  parentCommentId?: number;
}
