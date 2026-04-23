import { Body, Controller, Inject, Ip, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SIGN_IN_USE_CASE } from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { SignInUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/sign-in.use-case.interface';
import { SignInRequestDto } from '@src/modules/auth/adapters/http/dto/request/sign-in.request.dto';
import { SignInResponseDto } from '@src/modules/auth/adapters/http/dto/response/sign-in.response.dto';
import { SignInMapper } from '@src/modules/auth/adapters/http/mappers/sign-in.mapper';
import { SignInRequestMapper } from '@src/modules/auth/adapters/http/mappers/sign-in-request.mapper';

@ApiTags('Auth')
@Controller('auth')
export class SignInController {
  constructor(
    @Inject(SIGN_IN_USE_CASE)
    private readonly signInUseCase: SignInUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Sign in',
    description:
      'Authenticates the user and returns access and refresh tokens.',
  })
  @ApiOkResponse({
    description: 'User signed in successfully.',
    type: SignInResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials.',
  })
  @Post('sign-in')
  public async handle(
    @Body() body: SignInRequestDto,
    @Req() request: Request,
    @Ip() ipAddress: string,
  ): Promise<SignInResponseDto> {
    const result = await this.signInUseCase.execute(
      SignInRequestMapper.toInput(
        body,
        request.headers['user-agent'],
        ipAddress,
      ),
    );

    return SignInMapper.toResponse(result);
  }
}
