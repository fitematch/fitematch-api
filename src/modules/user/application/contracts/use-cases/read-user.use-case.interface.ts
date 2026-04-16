import type { ReadUserInputDto } from '@src/modules/user/application/dto/input/read-user.input.dto';
import type { ReadUserOutputDto } from '@src/modules/user/application/dto/output/read-user.output.dto';

export interface ReadUserUseCaseInterface {
  execute(input: ReadUserInputDto): Promise<ReadUserOutputDto | null>;
}
