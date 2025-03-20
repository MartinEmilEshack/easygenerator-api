import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserApiDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  @ApiProperty({ required: false })
  username: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ required: false })
  email: string;
}
