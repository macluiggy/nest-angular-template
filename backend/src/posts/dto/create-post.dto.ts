import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Hello, World!' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 1 })
  userId: number;
}
