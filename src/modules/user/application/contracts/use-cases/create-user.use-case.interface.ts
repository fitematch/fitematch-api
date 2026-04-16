import { CreateUserInputDto } from '@src/modules/user/application/dto/input/create-user.input.dto';
import { CreateUserOutputDto } from '@src/modules/user/application/dto/output/create-user.output.dto';

export interface CreateUserUseCaseInterface {
  execute(input: CreateUserInputDto): Promise<CreateUserOutputDto>;
}
