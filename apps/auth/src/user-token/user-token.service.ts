import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserToken } from './schemas/user-token';
import { UserTokenType } from './types/user-token-type';

@Injectable()
export class UserTokenService {
  constructor(
    @InjectModel(UserToken.name)
    private readonly userTokenModel: Model<UserToken>,
  ) {}

  async create(userId: string, type: UserTokenType) {
    const userToken = await this.userTokenModel.create({
      userId,
      tokenVersion: 1,
      type,
    });

    return userToken;
  }

  async findOne(userId: string, type: UserTokenType) {
    return await this.userTokenModel.findOne({ userId, type }).exec();
  }

  async incrementTokenVersion(userId: string, type: UserTokenType) {
    const user = await this.userTokenModel.findOne({ userId, type }).exec();

    if (!user) throw new UnauthorizedException('User not logged in');

    await this.userTokenModel
      .updateOne({ userId, type }, { $inc: { tokenVersion: 1 } })
      .exec();

    return { ...user, tokenVersion: user.tokenVersion + 1 };
  }

  async remove(userId: string, type: UserTokenType) {
    await this.userTokenModel.deleteOne({ userId, type }).exec();
  }

  async removeAll(userId: string) {
    await this.userTokenModel.deleteOne({ userId }).exec();
  }
}
