import type { UpdateMeInputDto } from '@src/modules/auth/application/dto/input/update-me.input.dto';
import type { UpdateMeOutputDto } from '@src/modules/auth/application/dto/output/update-me.output.dto';

export interface UpdateMeUseCaseInterface {
  execute(input: UpdateMeInputDto): Promise<UpdateMeOutputDto | null>;
}
