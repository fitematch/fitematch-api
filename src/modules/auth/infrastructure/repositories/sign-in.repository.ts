import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  UserSchema,
  type UserDocument,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import type {
  SignInRepositoryInterface,
  SignInUserData,
} from '@src/modules/auth/application/contracts/repositories/sign-in.repository.interface';

@Injectable()
export class SignInRepository implements SignInRepositoryInterface {
  constructor(
    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  public async findByEmail(email: string): Promise<SignInUserData | null> {
    const user = await this.userModel.findOne({ email }).lean().exec();

    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      status: user.status,
      productRole: user.productRole,
      adminRole: user.adminRole,
      recruiterProfile: user.recruiterProfile,
    };
  }
}
