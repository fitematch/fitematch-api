import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SIGN_OUT_USE_CASE } from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { SignOutUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/sign-out.use-case.interface';
import { SignOutRequestDto } from '@src/modules/auth/adapters/http/dto/request/sign-out.request.dto';
import { SignOutResponseDto } from '@src/modules/auth/adapters/http/dto/response/sign-out.response.dto';
import { SignOutRequestMapper } from '@src/modules/auth/adapters/http/mappers/sign-out-request.mapper';
import { SignOutMapper } from '@src/modules/auth/adapters/http/mappers/sign-out.mapper';

@ApiTags('Auth')
@Controller('auth')
export class SignOutController {
  constructor(
    @Inject(SIGN_OUT_USE_CASE)
    private readonly signOutUseCase: SignOutUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Sign out',
    description: 'Signs out the user. The client must clear local tokens.',
  })
  @ApiOkResponse({
    description: 'Signed out successfully!',
    type: SignOutResponseDto,
  })
  @Post('sign-out')
  public async handle(
    @Body() body: SignOutRequestDto,
  ): Promise<SignOutResponseDto> {
    const result = await this.signOutUseCase.execute(
      SignOutRequestMapper.toInput(body),
    );

    return SignOutMapper.toResponse(result);
  }
}
