import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ACTIVATION_CODE_REPOSITORY,
  CREATE_ACTIVATION_CODE_REPOSITORY,
} from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { CreateActivationCodeUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/create-activation-code.use-case.interface';
import type { CreateActivationCodeRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/create-activation-code.repository.interface';
import type { ActivationCodeRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/activation-code.repository.interface';
import { CreateActivationCodeInputDto } from '@src/modules/auth/application/dto/input/create-activation-code.input.dto';
import { CreateActivationCodeOutputDto } from '@src/modules/auth/application/dto/output/create-activation-code.output.dto';
import { ActivationCodeTypeEnum } from '@src/modules/auth/domain/enums/activation-code-type.enum';
import { ActivationCodeUtils } from '@src/shared/utils/activation-code.utils';

@Injectable()
export class CreateActivationCodeUseCase implements CreateActivationCodeUseCaseInterface {
  constructor(
    @Inject(CREATE_ACTIVATION_CODE_REPOSITORY)
    private readonly createActivationCodeRepository: CreateActivationCodeRepositoryInterface,
    @Inject(ACTIVATION_CODE_REPOSITORY)
    private readonly activationCodeRepository: ActivationCodeRepositoryInterface,
  ) {}

  public async execute(
    input: CreateActivationCodeInputDto,
  ): Promise<CreateActivationCodeOutputDto> {
    const user = await this.createActivationCodeRepository.findByEmail(
      input.email,
    );

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (user.status === 'active') {
      throw new BadRequestException('Account already activated.');
    }

    await this.activationCodeRepository.invalidateActiveCodes(
      user.id,
      ActivationCodeTypeEnum.ACCOUNT_ACTIVATION,
    );

    await this.activationCodeRepository.create({
      userId: user.id,
      code: ActivationCodeUtils.generateSixDigits(),
      type: ActivationCodeTypeEnum.ACCOUNT_ACTIVATION,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    return {
      message: 'Activation code generated successfully.',
    };
  }
}
