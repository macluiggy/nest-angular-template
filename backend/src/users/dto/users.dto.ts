import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UserDto {
  @ApiProperty({ example: 'john_doe' })
  @IsNotEmpty()
  @IsString()
  @Length(0, 20)
  username: string;

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isPasswordReset?: boolean;

  @ApiProperty({ example: 'This is my signature' })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  signature?: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 'admin' })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiProperty({ example: '2022-01-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  createdAt?: Date;

  @ApiProperty({ example: '2022-01-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  updatedAt?: Date;

  @ApiProperty({ example: '2022-01-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  deletedAt?: Date;

  @ApiProperty({ example: '1234567890' })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  phone?: string;

  profileImage?: Express.Multer.File;
}
