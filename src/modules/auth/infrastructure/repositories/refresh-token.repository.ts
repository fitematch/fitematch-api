import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  UserSchema,
  type UserDocument,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import type {
  RefreshTokenRepositoryInterface,
  RefreshTokenUserData,
} from '@src/modules/auth/application/contracts/repositories/refresh-token.repository.interface';

@Injectable()
export class RefreshTokenRepository implements RefreshTokenRepositoryInterface {
  constructor(
    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  public async findById(id: string): Promise<RefreshTokenUserData | null> {
    const user = await this.userModel.findById(id).lean().exec();

    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      email: user.email,
      productRole: user.productRole,
      adminRole: user.adminRole,
      status: user.status,
    };
  }
}
