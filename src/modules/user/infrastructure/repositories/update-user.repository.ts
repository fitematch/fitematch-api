import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { UpdateUserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/update-user.repository.interface';
import type { UpdateUserInputDto } from '@src/modules/user/application/dto/input/update-user.input.dto';
import type { UpdateUserOutputDto } from '@src/modules/user/application/dto/output/update-user.output.dto';
import {
  UserSchema,
  type UserDocument,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';

@Injectable()
export class UpdateUserRepository implements UpdateUserRepositoryInterface {
  constructor(
    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async update(input: UpdateUserInputDto): Promise<UpdateUserOutputDto | null> {
    const updatedUser = (await this.userModel
      .findByIdAndUpdate(
        input.id,
        {
          ...(input.name !== undefined && { name: input.name }),
          ...(input.email !== undefined && { email: input.email }),
          ...(input.password !== undefined && { password: input.password }),
          ...(input.birthday !== undefined && {
            birthday: input.birthday ? new Date(input.birthday) : undefined,
          }),
          ...(input.candidateProfile !== undefined && {
            candidateProfile: input.candidateProfile,
          }),
          ...(input.recruiterProfile !== undefined && {
            recruiterProfile: input.recruiterProfile,
          }),
          ...(input.productRole !== undefined && {
            productRole: input.productRole,
          }),
          ...(input.adminRole !== undefined && { adminRole: input.adminRole }),
          ...(input.status !== undefined && { status: input.status }),
        },
        { new: true },
      )
      .lean()
      .exec()) as
      | (UpdateUserOutputDto & { _id: { toString(): string } })
      | null;

    if (!updatedUser) {
      return null;
    }

    return {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      birthday: updatedUser.birthday
        ? new Date(updatedUser.birthday).toISOString().split('T')[0]
        : undefined,
      candidateProfile: updatedUser.candidateProfile,
      recruiterProfile: updatedUser.recruiterProfile,
      productRole: updatedUser.productRole,
      adminRole: updatedUser.adminRole,
      status: updatedUser.status,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }
}
