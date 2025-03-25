import { Request } from '@nestjs/common';
import { AccessTokenPayloadDto } from 'libs/proto/schemas/auth';

export interface RequestWithPayload extends Request {
  jwtPayload: AccessTokenPayloadDto;
}
