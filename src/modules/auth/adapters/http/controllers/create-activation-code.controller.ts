import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CREATE_ACTIVATION_CODE_USE_CASE } from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { CreateActivationCodeUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/create-activation-code.use-case.interface';
import { CreateActivationCodeRequestDto } from '@src/modules/auth/adapters/http/dto/request/create-activation-code.request.dto';
import { CreateActivationCodeResponseDto } from '@src/modules/auth/adapters/http/dto/response/create-activation-code.response.dto';
import { CreateActivationCodeRequestMapper } from '@src/modules/auth/adapters/http/mappers/create-activation-code-request.mapper';
import { CreateActivationCodeMapper } from '@src/modules/auth/adapters/http/mappers/create-activation-code.mapper';

@ApiTags('Auth')
@Controller('auth')
export class CreateActivationCodeController {
  constructor(
    @Inject(CREATE_ACTIVATION_CODE_USE_CASE)
    private readonly createActivationCodeUseCase: CreateActivationCodeUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Create activation code',
    description: 'Generates a new activation code for a pending account.',
  })
  @ApiOkResponse({
    description: 'Activation code generated successfully.',
    type: CreateActivationCodeResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  @ApiBadRequestResponse({
    description: 'Account already activated.',
  })
  @Post('activation-code')
  public async handle(
    @Body() body: CreateActivationCodeRequestDto,
  ): Promise<CreateActivationCodeResponseDto> {
    const result = await this.createActivationCodeUseCase.execute(
      CreateActivationCodeRequestMapper.toInput(body),
    );

    return CreateActivationCodeMapper.toResponse(result);
  }
}
