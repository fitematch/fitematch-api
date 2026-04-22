import type { ActivateAccountInputDto } from '@src/modules/auth/application/dto/input/activate-account.input.dto';
import type { ActivateAccountOutputDto } from '@src/modules/auth/application/dto/output/activate-account.output.dto';

export interface ActivateAccountUseCaseInterface {
  execute(input: ActivateAccountInputDto): Promise<ActivateAccountOutputDto>;
}
