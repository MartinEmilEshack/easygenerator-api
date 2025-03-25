import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserToken, UserTokenSchema } from './schemas/user-token';
import { UserTokenService } from './user-token.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserToken.name, schema: UserTokenSchema },
    ]),
  ],
  providers: [UserTokenService],
  exports: [UserTokenService],
})
export class UserTokenModule {}
