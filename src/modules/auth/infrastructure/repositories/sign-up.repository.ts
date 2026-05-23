import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  UserSchema,
  type UserDocument,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import type { SignUpRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/sign-up.repository.interface';
import type { SignUpInputDto } from '@src/modules/auth/application/dto/input/sign-up.input.dto';
import type { SignUpOutputDto } from '@src/modules/auth/application/dto/output/sign-up.output.dto';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';

@Injectable()
export class SignUpRepository implements SignUpRepositoryInterface {
  constructor(
    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email }).lean().exec();

    return !!user;
  }

  async create(
    input: SignUpInputDto & { password: string; status: UserStatusEnum },
  ): Promise<SignUpOutputDto> {
    const createdUser = await this.userModel.create({
      name: input.name,
      email: input.email,
      password: input.password,
      birthday: input.birthday,
      productRole: input.productRole,
      status: input.status,
    });

    const user = createdUser.toObject();
    const timestamps = user as typeof user & {
      createdAt?: Date;
      updatedAt?: Date;
    };

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      birthday: user.birthday.toISOString().split('T')[0],
      productRole: input.productRole,
      status: user.status,
      createdAt: timestamps.createdAt,
      updatedAt: timestamps.updatedAt,
    };
  }
}
