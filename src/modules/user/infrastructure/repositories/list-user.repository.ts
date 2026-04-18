import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { ListUserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/list-user.repository.interface';
import type { ListUserInputDto } from '@src/modules/user/application/dto/input/list-user.input.dto';
import type { ListUserRepositoryOutputDto } from '@src/modules/user/application/dto/output/list-user.repository-output.dto';
import {
  UserSchema,
  type UserDocument,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import { UserPersistenceMapper } from '@src/modules/user/infrastructure/database/mappers/user.persistence.mapper';
import type { LeanUser } from '@src/modules/user/infrastructure/database/types/user-lean.type';

@Injectable()
export class ListUserRepository implements ListUserRepositoryInterface {
  constructor(
    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async list(input: ListUserInputDto): Promise<ListUserRepositoryOutputDto[]> {
    const page = input.page && input.page > 0 ? input.page : 1;
    const limit = input.limit && input.limit > 0 ? input.limit : 10;
    const skip = (page - 1) * limit;

    const filters: Record<string, unknown> = {};

    if (input.status) {
      filters.status = input.status;
    }

    if (input.search) {
      filters.$or = [
        { name: { $regex: input.search, $options: 'i' } },
        { email: { $regex: input.search, $options: 'i' } },
        {
          'candidateProfile.documents.rg.number': {
            $regex: input.search,
            $options: 'i',
          },
        },
        {
          'candidateProfile.documents.cpf.number': {
            $regex: input.search,
            $options: 'i',
          },
        },
      ];
    }

    const users = (await this.userModel
      .find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec()) as LeanUser[];

    return users.map((user) => UserPersistenceMapper.toListOutput(user));
  }
}
