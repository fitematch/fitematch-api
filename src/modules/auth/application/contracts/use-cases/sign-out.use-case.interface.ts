import type { SignOutInputDto } from '@src/modules/auth/application/dto/input/sign-out.input.dto';
import type { SignOutOutputDto } from '@src/modules/auth/application/dto/output/sign-out.output.dto';

export interface SignOutUseCaseInterface {
  execute(input: SignOutInputDto): Promise<SignOutOutputDto>;
}
