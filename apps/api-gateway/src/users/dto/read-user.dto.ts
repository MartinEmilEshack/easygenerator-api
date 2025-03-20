import { User } from '@easygen/proto/auth';
import { ApiProperty } from '@nestjs/swagger';

export class ReadUserApiDto implements Pick<User, 'id' | 'username' | 'email'> {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;
}
