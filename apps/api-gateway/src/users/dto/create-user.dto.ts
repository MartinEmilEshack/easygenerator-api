import { CreateUserDto } from '@easygen/proto/auth';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserApiDto implements CreateUserDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
