import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import {
  HASH_SERVICE,
  SIGN_UP_REPOSITORY,
  ACTIVATION_CODE_REPOSITORY,
  EMAIL_PROVIDER,
} from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { SignUpUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/sign-up.use-case.interface';
import type { SignUpRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/sign-up.repository.interface';
import type { ActivationCodeRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/activation-code.repository.interface';
import type { HashServiceInterface } from '@src/modules/auth/application/contracts/services/hash.service.interface';
import type { EmailProviderInterface } from '@src/modules/auth/application/contracts/providers/email-provider.interface';
import { SignUpInputDto } from '@src/modules/auth/application/dto/input/sign-up.input.dto';
import { SignUpOutputDto } from '@src/modules/auth/application/dto/output/sign-up.output.dto';
import { ActivationCodeTypeEnum } from '@src/modules/auth/domain/enums/activation-code-type.enum';
import { ActivationCodeUtils } from '@src/shared/utils/activation-code.utils';

@Injectable()
export class SignUpUseCase implements SignUpUseCaseInterface {
  private readonly logger = new Logger(SignUpUseCase.name);

  constructor(
    @Inject(SIGN_UP_REPOSITORY)
    private readonly signUpRepository: SignUpRepositoryInterface,

    @Inject(ACTIVATION_CODE_REPOSITORY)
    private readonly activationCodeRepository: ActivationCodeRepositoryInterface,

    @Inject(HASH_SERVICE)
    private readonly hashService: HashServiceInterface,

    @Inject(EMAIL_PROVIDER)
    private readonly emailProvider: EmailProviderInterface,
  ) {}

  public async execute(input: SignUpInputDto): Promise<SignUpOutputDto> {
    if (
      input.productRole !== ProductRoleEnum.CANDIDATE &&
      input.productRole !== ProductRoleEnum.RECRUITER
    ) {
      throw new BadRequestException('Invalid product role for sign up.');
    }

    const emailAlreadyExists = await this.signUpRepository.existsByEmail(
      input.email,
    );

    if (emailAlreadyExists) {
      throw new ConflictException('Email already in use.');
    }

    const hashedPassword = await this.hashService.hash(input.password);

    const createdUser = await this.signUpRepository.create({
      ...input,
      password: hashedPassword,
      status: 'pending',
    });

    await this.activationCodeRepository.invalidateActiveCodes(
      createdUser.id,
      ActivationCodeTypeEnum.ACCOUNT_ACTIVATION,
    );

    const activationCode = ActivationCodeUtils.generateSixDigits();
    const codeHash = await this.hashService.hash(activationCode);
    const expiresInMinutes = Number(
      process.env.ACTIVATION_CODE_EXPIRES_IN_MINUTES || 15,
    );

    await this.activationCodeRepository.create({
      userId: createdUser.id,
      codeHash,
      type: ActivationCodeTypeEnum.ACCOUNT_ACTIVATION,
      expiresAt: new Date(Date.now() + expiresInMinutes * 60 * 1000),
      attemptsCount: 0,
      maxAttempts: 5,
    });

    try {
      await this.emailProvider.sendActivationCode({
        to: createdUser.email,
        name: createdUser.name,
        code: activationCode,
        expiresInMinutes,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown email provider error';

      this.logger.error(
        `Failed to send activation code email to ${createdUser.email}: ${message}`,
      );
    }

    return createdUser;
  }
}
