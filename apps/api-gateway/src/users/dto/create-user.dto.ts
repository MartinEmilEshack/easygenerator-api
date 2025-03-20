import { CreateUserDto } from '@easygen/proto/auth';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateUserApiDto implements CreateUserDto {
  @IsString()
  @MinLength(3)
  @ApiProperty()
  username: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsStrongPassword()
  @ApiProperty()
  password: string;
}
