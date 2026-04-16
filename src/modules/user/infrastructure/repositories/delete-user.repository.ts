import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import type { DeleteUserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/delete-user.repository.interface';
import type { DeleteUserInputDto } from '@src/modules/user/application/dto/input/delete-user.input.dto';
import {
  UserSchema,
  type UserDocument,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';

@Injectable()
export class DeleteUserRepository implements DeleteUserRepositoryInterface {
  constructor(
    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async delete(input: DeleteUserInputDto): Promise<boolean> {
    const deletedUser = await this.userModel
      .findByIdAndDelete(input.id)
      .lean()
      .exec();

    return !!deletedUser;
  }
}
