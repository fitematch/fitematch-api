import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { CreateUserUseCaseInterface } from '@src/modules/user/application/contracts/use-cases/create-user.use-case.interface';
import { CREATE_USER_USE_CASE } from '@src/modules/user/application/contracts/tokens/user.tokens';
import { CreateUserRequestDto } from '@src/modules/user/adapters/http/dto/request/create-user.request.dto';
import { CreateUserResponseDto } from '@src/modules/user/adapters/http/dto/response/create-user.response.dto';
import { CreateUserMapper } from '@src/modules/user/adapters/http/mappers/create-user.mapper';
import { CreateUserRequestMapper } from '@src/modules/user/adapters/http/mappers/create-user-request.mapper';

@ApiTags('User')
@ApiBearerAuth('JWT')
@Controller('user')
export class CreateUserController {
  constructor(
    @Inject(CREATE_USER_USE_CASE)
    private readonly createUserUseCase: CreateUserUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Create a new user',
    description: 'Creates a new user.',
  })
  @ApiCreatedResponse({
    description: 'User created successfully.',
    type: CreateUserResponseDto,
  })
  @Post()
  async handle(
    @Body() body: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    const result = await this.createUserUseCase.execute(
      CreateUserRequestMapper.toInput(body),
    );

    console.log(result);

    return CreateUserMapper.toResponse(result);
  }
}
