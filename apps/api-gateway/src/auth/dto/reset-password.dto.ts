import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword } from 'class-validator';

export class ResetPasswordApiDto {
  @IsString()
  @ApiProperty()
  resetToken: string;

  @IsStrongPassword()
  @ApiProperty()
  password: string;
}
