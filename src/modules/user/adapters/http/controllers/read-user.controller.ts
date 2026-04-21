import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { ReadUserUseCaseInterface } from '@src/modules/user/application/contracts/use-cases/read-user.use-case.interface';
import { READ_USER_USE_CASE } from '@src/modules/user/application/contracts/tokens/user.tokens';
import { ReadUserParamsDto } from '@src/modules/user/adapters/http/dto/request/read-user.params.dto';
import { ReadUserResponseDto } from '@src/modules/user/adapters/http/dto/response/read-user.response.dto';
import { ReadUserMapper } from '@src/modules/user/adapters/http/mappers/read-user.mapper';
import { ReadUserRequestMapper } from '@src/modules/user/adapters/http/mappers/read-user-request.mapper';

@ApiTags('User')
@ApiBearerAuth('JWT')
@Controller('user')
export class ReadUserController {
  constructor(
    @Inject(READ_USER_USE_CASE)
    private readonly readUserUseCase: ReadUserUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Read one user',
    description: 'Returns a user by ID.',
  })
  @ApiOkResponse({
    description: 'User returned successfully.',
    type: ReadUserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found!',
  })
  @Get(':_id')
  async handle(
    @Param() params: ReadUserParamsDto,
  ): Promise<ReadUserResponseDto> {
    const result = await this.readUserUseCase.execute(
      ReadUserRequestMapper.toInput(params),
    );

    if (!result) {
      throw new NotFoundException('User not found!');
    }

    return ReadUserMapper.toResponse(result);
  }
}
