import { ApiProperty } from '@nestjs/swagger';

export class ReadUserApiDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;
}
