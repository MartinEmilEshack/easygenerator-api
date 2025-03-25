import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserTokenType } from '../types/user-token-type';

export type UserTokenDocument = HydratedDocument<UserToken>;

@Schema()
export class UserToken {
  @Prop({ immutable: true, auto: true })
  id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ required: true })
  tokenVersion: number;

  @Prop({ required: true, type: String, enum: ['reset', 'grant'] })
  type: UserTokenType;
}

export const UserTokenSchema = SchemaFactory.createForClass(UserToken);
