import { ListUserInputDto } from '@src/modules/user/application/dto/input/list-user.input.dto';
import { ListUserOutputDto } from '@src/modules/user/application/dto/output/list-user.output.dto';

export interface ListUserUseCaseInterface {
  execute(input: ListUserInputDto): Promise<ListUserOutputDto[]>;
}
