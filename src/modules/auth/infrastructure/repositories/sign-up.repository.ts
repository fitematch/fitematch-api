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
    input: SignUpInputDto & { password: string; status: string },
  ): Promise<SignUpOutputDto> {
    const createdUser = await this.userModel.create({
      name: input.name,
      email: input.email,
      password: input.password,
      birthday: input.birthday,
      productRole: input.productRole,
      status: input.status,
    });

    const timestamps = createdUser as unknown as {
      createdAt?: Date;
      updatedAt?: Date;
    };

    return {
      id: createdUser._id.toString(),
      name: createdUser.name,
      email: createdUser.email,
      birthday: createdUser.birthday.toISOString().split('T')[0],
      productRole: input.productRole,
      status: createdUser.status,
      createdAt: timestamps.createdAt,
      updatedAt: timestamps.updatedAt,
    };
  }
}
