import type { SignUpInputDto } from '@src/modules/auth/application/dto/input/sign-up.input.dto';
import type { SignUpOutputDto } from '@src/modules/auth/application/dto/output/sign-up.output.dto';

export interface SignUpUseCaseInterface {
  execute(input: SignUpInputDto): Promise<SignUpOutputDto>;
}
