import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  UserSchema,
  type UserDocument,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import type {
  CreateActivationCodeRepositoryInterface,
  CreateActivationCodeUserData,
} from '@src/modules/auth/application/contracts/repositories/create-activation-code.repository.interface';

@Injectable()
export class CreateActivationCodeRepository implements CreateActivationCodeRepositoryInterface {
  constructor(
    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  public async findByEmail(
    email: string,
  ): Promise<CreateActivationCodeUserData | null> {
    const user = await this.userModel.findOne({ email }).lean().exec();

    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      status: user.status,
    };
  }
}
