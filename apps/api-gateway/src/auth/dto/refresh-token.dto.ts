import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenApiDto {
  @IsString()
  @ApiProperty()
  refreshToken: string;
}
