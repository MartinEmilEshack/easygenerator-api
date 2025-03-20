import { User } from '@easygen/proto/auth';
import { ApiProperty } from '@nestjs/swagger';

export class ApiUser implements User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ writeOnly: true })
  password: string;
}
