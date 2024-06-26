import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLikeDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  postId: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  userId: number;
}
