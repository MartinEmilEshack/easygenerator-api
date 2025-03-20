import { UpdateUserDto } from '@easygen/proto/auth';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserApiDto implements Partial<UpdateUserDto> {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  username: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ required: false })
  email: string;
}
