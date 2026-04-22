import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  UserSchema,
  type UserDocument,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import type {
  ActivateAccountRepositoryInterface,
  ActivateAccountUserData,
} from '@src/modules/auth/application/contracts/repositories/activate-account.repository.interface';

@Injectable()
export class ActivateAccountRepository implements ActivateAccountRepositoryInterface {
  constructor(
    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  public async findByEmail(
    email: string,
  ): Promise<ActivateAccountUserData | null> {
    const user = await this.userModel.findOne({ email }).lean().exec();

    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      email: user.email,
      status: user.status,
    };
  }

  public async activateUser(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      status: 'active',
    });
  }
}
