import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  UserSchema,
  type UserDocument,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import type { UpdateMeRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/update-me.repository.interface';
import type { UpdateMeInputDto } from '@src/modules/auth/application/dto/input/update-me.input.dto';
import type { UpdateMeOutputDto } from '@src/modules/auth/application/dto/output/update-me.output.dto';

@Injectable()
export class UpdateMeRepository implements UpdateMeRepositoryInterface {
  constructor(
    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  public async update(
    input: UpdateMeInputDto,
  ): Promise<UpdateMeOutputDto | null> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        input.userId,
        {
          ...(input.name !== undefined && { name: input.name }),
          ...(input.birthday !== undefined && { birthday: input.birthday }),
        },
        {
          returnDocument: 'after',
        },
      )
      .lean()
      .exec();

    if (!updatedUser) {
      return null;
    }

    const timestamps = updatedUser as typeof updatedUser & {
      createdAt?: Date;
      updatedAt?: Date;
    };

    return {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      birthday: updatedUser.birthday
        ? new Date(updatedUser.birthday).toISOString().split('T')[0]
        : undefined,
      productRole: updatedUser.productRole,
      adminRole: updatedUser.adminRole,
      status: updatedUser.status,
      createdAt: timestamps.createdAt,
      updatedAt: timestamps.updatedAt,
    };
  }
}
