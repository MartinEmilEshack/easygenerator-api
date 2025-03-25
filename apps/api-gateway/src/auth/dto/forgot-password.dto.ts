import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordApiDto {
  @IsEmail()
  @ApiProperty()
  email: string;
}
