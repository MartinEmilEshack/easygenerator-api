import {
  AuthServicePasswordHashConfig,
  AuthServicePasswordHashConfigType,
} from '@easygen/sys-configs/auth-service';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @Inject(AuthServicePasswordHashConfig.KEY)
    private readonly sysConfig: AuthServicePasswordHashConfigType,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(email: string, password: string) {
    const existingUser = await this.userModel.findOne({ email }).exec();

    if (existingUser) throw new ConflictException('User already exists');

    const hashedPassword = await bcrypt.hash(
      password,
      this.sysConfig.hashRounds,
    );

    const user = await this.userModel.create({
      email,
      password: hashedPassword,
    });

    return user;
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findOne({ _id: id }).exec();

    if (!user) throw new NotFoundException(`User of id ${id} not found`);
    else return user;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) throw new NotFoundException(`User of email ${email} not found`);
    else return user;
  }

  async update(
    id: string,
    newUserData: Partial<Pick<User, 'email' | 'password'>>,
  ) {
    const user = await this.userModel.findOne({ _id: id }).exec();

    if (!user) throw new NotFoundException(`User of id ${id} not found`);
    else {
      user.email = newUserData.email ?? user.email;
      user.password = newUserData.password ?? user.password;

      await user.save();
    }

    return user;
  }

  async remove(id: string) {
    const user = await this.userModel.findOne({ _id: id }).exec();

    if (!user) throw new NotFoundException(`User of id ${id} not found`);
    else {
      await this.userModel.deleteOne({ _id: id }).exec();
      return user;
    }
  }
}
