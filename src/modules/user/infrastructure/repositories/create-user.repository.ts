import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { CreateUserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/create-user.repository.interface';
import type { CreateUserInputDto } from '@src/modules/user/application/dto/input/create-user.input.dto';
import type { CreateUserOutputDto } from '@src/modules/user/application/dto/output/create-user.output.dto';
import {
  UserSchema,
  type UserDocument,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';

@Injectable()
export class CreateUserRepository implements CreateUserRepositoryInterface {
  constructor(
    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(input: CreateUserInputDto): Promise<CreateUserOutputDto> {
    const createdUser = await this.userModel.create({
      name: input.name,
      email: input.email,
      password: input.password,
      birthday: input.birthday ? new Date(input.birthday) : undefined,
      candidateProfile: input.candidateProfile,
      recruiterProfile: input.recruiterProfile,
      productRole: input.productRole,
      adminRole: input.adminRole,
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
      birthday: createdUser.birthday
        ? createdUser.birthday.toISOString().split('T')[0]
        : undefined,
      candidateProfile:
        createdUser.candidateProfile as CreateUserOutputDto['candidateProfile'],
      recruiterProfile:
        createdUser.recruiterProfile as CreateUserOutputDto['recruiterProfile'],
      status: createdUser.status,
      productRole: createdUser.productRole,
      adminRole: createdUser.adminRole,
      createdAt: timestamps.createdAt,
      updatedAt: timestamps.updatedAt,
    };
  }
}
