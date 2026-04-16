import type { UpdateUserInputDto } from '@src/modules/user/application/dto/input/update-user.input.dto';
import type { UpdateUserOutputDto } from '@src/modules/user/application/dto/output/update-user.output.dto';

export interface UpdateUserUseCaseInterface {
  execute(input: UpdateUserInputDto): Promise<UpdateUserOutputDto | null>;
}
