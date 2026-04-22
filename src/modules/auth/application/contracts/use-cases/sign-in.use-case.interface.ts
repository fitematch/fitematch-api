import type { SignInInputDto } from '@src/modules/auth/application/dto/input/sign-in.input.dto';
import type { SignInOutputDto } from '@src/modules/auth/application/dto/output/sign-in.output.dto';

export interface SignInUseCaseInterface {
  execute(input: SignInInputDto): Promise<SignInOutputDto>;
}
