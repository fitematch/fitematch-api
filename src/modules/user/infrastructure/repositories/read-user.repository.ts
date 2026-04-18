import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { ReadUserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/read-user.repository.interface';
import type { ReadUserInputDto } from '@src/modules/user/application/dto/input/read-user.input.dto';
import type { ReadUserOutputDto } from '@src/modules/user/application/dto/output/read-user.output.dto';
import {
  UserSchema,
  type UserDocument,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';

@Injectable()
export class ReadUserRepository implements ReadUserRepositoryInterface {
  constructor(
    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async read(input: ReadUserInputDto): Promise<ReadUserOutputDto | null> {
    const user = (await this.userModel.findById(input.id).lean().exec()) as
      | (ReadUserOutputDto & { _id: { toString(): string } })
      | null;

    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      birthday: user.birthday
        ? new Date(user.birthday).toISOString().split('T')[0]
        : undefined,
      candidateProfile: user.candidateProfile,
      recruiterProfile: user.recruiterProfile,
      productRole: user.productRole,
      adminRole: user.adminRole,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
