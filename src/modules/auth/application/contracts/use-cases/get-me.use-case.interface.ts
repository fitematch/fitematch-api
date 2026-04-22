import type { GetMeInputDto } from '@src/modules/auth/application/dto/input/get-me.input.dto';
import type { GetMeOutputDto } from '@src/modules/auth/application/dto/output/get-me.output.dto';

export interface GetMeUseCaseInterface {
  execute(input: GetMeInputDto): Promise<GetMeOutputDto | null>;
}
