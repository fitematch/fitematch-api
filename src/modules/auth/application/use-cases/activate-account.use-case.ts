import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ACTIVATE_ACCOUNT_REPOSITORY,
  ACTIVATION_CODE_REPOSITORY,
} from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { ActivateAccountUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/activate-account.use-case.interface';
import type { ActivateAccountRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/activate-account.repository.interface';
import type { ActivationCodeRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/activation-code.repository.interface';
import { ActivateAccountInputDto } from '@src/modules/auth/application/dto/input/activate-account.input.dto';
import { ActivateAccountOutputDto } from '@src/modules/auth/application/dto/output/activate-account.output.dto';
import { ActivationCodeTypeEnum } from '@src/modules/auth/domain/enums/activation-code-type.enum';

@Injectable()
export class ActivateAccountUseCase implements ActivateAccountUseCaseInterface {
  constructor(
    @Inject(ACTIVATE_ACCOUNT_REPOSITORY)
    private readonly activateAccountRepository: ActivateAccountRepositoryInterface,
    @Inject(ACTIVATION_CODE_REPOSITORY)
    private readonly activationCodeRepository: ActivationCodeRepositoryInterface,
  ) {}

  public async execute(
    input: ActivateAccountInputDto,
  ): Promise<ActivateAccountOutputDto> {
    const user = await this.activateAccountRepository.findByEmail(input.email);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (user.status === 'active') {
      throw new BadRequestException('Account already activated.');
    }

    const activationCode = await this.activationCodeRepository.findValidCode(
      user.id,
      input.code,
      ActivationCodeTypeEnum.ACCOUNT_ACTIVATION,
    );

    if (!activationCode) {
      throw new BadRequestException('Invalid activation code.');
    }

    if (activationCode.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Activation code expired.');
    }

    await this.activationCodeRepository.markAsUsed(activationCode.id);
    await this.activateAccountRepository.activateUser(user.id);

    return {
      message: 'Account activated successfully.',
    };
  }
}
