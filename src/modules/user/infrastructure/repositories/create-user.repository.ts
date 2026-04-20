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
    const plainUser = createdUser.toObject() as {
      _id: { toString(): string };
      name: string;
      email: string;
      birthday?: Date;
      candidateProfile?: CreateUserOutputDto['candidateProfile'];
      recruiterProfile?: CreateUserOutputDto['recruiterProfile'];
      status?: CreateUserOutputDto['status'];
      productRole?: CreateUserOutputDto['productRole'];
      adminRole?: CreateUserOutputDto['adminRole'];
      createdAt?: Date;
      updatedAt?: Date;
    };

    return {
      id: plainUser._id.toString(),
      name: plainUser.name,
      email: plainUser.email,
      birthday: plainUser.birthday
        ? plainUser.birthday.toISOString().split('T')[0]
        : undefined,
      candidateProfile: plainUser.candidateProfile,
      recruiterProfile: plainUser.recruiterProfile,
      status: plainUser.status,
      productRole: plainUser.productRole,
      adminRole: plainUser.adminRole,
      createdAt: plainUser.createdAt,
      updatedAt: plainUser.updatedAt,
    };
  }
}
