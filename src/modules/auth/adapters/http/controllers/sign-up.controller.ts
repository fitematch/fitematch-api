import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SIGN_UP_USE_CASE } from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { SignUpUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/sign-up.use-case.interface';
import { SignUpRequestDto } from '@src/modules/auth/adapters/http/dto/request/sign-up.request.dto';
import { SignUpResponseDto } from '@src/modules/auth/adapters/http/dto/response/sign-up.response.dto';
import { SignUpMapper } from '@src/modules/auth/adapters/http/mappers/sign-up.mapper';
import { SignUpRequestMapper } from '@src/modules/auth/adapters/http/mappers/sign-up-request.mapper';

@ApiTags('Auth')
@Controller('auth')
export class SignUpController {
  constructor(
    @Inject(SIGN_UP_USE_CASE)
    private readonly signUpUseCase: SignUpUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Sign up',
    description:
      'Creates a candidate or recruiter account with pending status.',
  })
  @ApiCreatedResponse({
    description: 'User signed up successfully.',
    type: SignUpResponseDto,
  })
  @ApiConflictResponse({
    description: 'Email already in use.',
  })
  @Post('sign-up')
  async handle(@Body() body: SignUpRequestDto): Promise<SignUpResponseDto> {
    const result = await this.signUpUseCase.execute(
      SignUpRequestMapper.toInput(body),
    );

    return SignUpMapper.toResponse(result);
  }
}
