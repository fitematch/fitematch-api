import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ACTIVATE_ACCOUNT_USE_CASE } from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { ActivateAccountUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/activate-account.use-case.interface';
import { ActivateAccountRequestDto } from '@src/modules/auth/adapters/http/dto/request/activate-account.request.dto';
import { ActivateAccountResponseDto } from '@src/modules/auth/adapters/http/dto/response/activate-account.response.dto';
import { ActivateAccountRequestMapper } from '@src/modules/auth/adapters/http/mappers/activate-account-request.mapper';
import { ActivateAccountMapper } from '@src/modules/auth/adapters/http/mappers/activate-account.mapper';

@ApiTags('Auth')
@Controller('auth')
export class ActivateAccountController {
  constructor(
    @Inject(ACTIVATE_ACCOUNT_USE_CASE)
    private readonly activateAccountUseCase: ActivateAccountUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Activate account',
    description:
      'Validates the activation code and activates the user account.',
  })
  @ApiOkResponse({
    description: 'Account activated successfully.',
    type: ActivateAccountResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  @ApiBadRequestResponse({
    description:
      'Invalid activation code, expired code, or account already activated.',
  })
  @Post('activate-account')
  public async handle(
    @Body() body: ActivateAccountRequestDto,
  ): Promise<ActivateAccountResponseDto> {
    const result = await this.activateAccountUseCase.execute(
      ActivateAccountRequestMapper.toInput(body),
    );

    return ActivateAccountMapper.toResponse(result);
  }
}
