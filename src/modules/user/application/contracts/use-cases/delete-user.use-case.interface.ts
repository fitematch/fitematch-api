import type { DeleteUserInputDto } from '@src/modules/user/application/dto/input/delete-user.input.dto';

export interface DeleteUserUseCaseInterface {
  execute(input: DeleteUserInputDto): Promise<boolean>;
}
