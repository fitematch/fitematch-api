import type { DeleteUserInputDto } from '@src/modules/user/application/dto/input/delete-user.input.dto';

export interface DeleteUserRepositoryInterface {
  delete(input: DeleteUserInputDto): Promise<boolean>;
}
