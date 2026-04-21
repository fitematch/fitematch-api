import type { SignUpInputDto } from '@src/modules/auth/application/dto/input/sign-up.input.dto';
import type { SignUpOutputDto } from '@src/modules/auth/application/dto/output/sign-up.output.dto';

export interface SignUpRepositoryInterface {
  existsByEmail(email: string): Promise<boolean>;
  create(
    input: SignUpInputDto & { password: string; status: string },
  ): Promise<SignUpOutputDto>;
}
