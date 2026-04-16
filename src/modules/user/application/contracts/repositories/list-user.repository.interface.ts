import { ListUserInputDto } from '@src/modules/user/application/dto/input/list-user.input.dto';
import { ListUserRepositoryOutputDto } from '@src/modules/user/application/dto/output/list-user.repository-output.dto';

export interface ListUserRepositoryInterface {
  list(input: ListUserInputDto): Promise<ListUserRepositoryOutputDto[]>;
}
