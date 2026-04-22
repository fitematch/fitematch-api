import type { CreateActivationCodeInputDto } from '@src/modules/auth/application/dto/input/create-activation-code.input.dto';
import type { CreateActivationCodeOutputDto } from '@src/modules/auth/application/dto/output/create-activation-code.output.dto';

export interface CreateActivationCodeUseCaseInterface {
  execute(
    input: CreateActivationCodeInputDto,
  ): Promise<CreateActivationCodeOutputDto>;
}
