import { Controller, Get, Inject, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { ListUserUseCaseInterface } from '@src/modules/user/application/contracts/use-cases/list-user.use-case.interface';
import { LIST_USER_USE_CASE } from '@src/modules/user/application/contracts/tokens/user.tokens';
import { ListUserQueryDto } from '@src/modules/user/adapters/http/dto/request/list-user.query.dto';
import { ListUserResponseDto } from '@src/modules/user/adapters/http/dto/response/list-user.response.dto';
import { ListUserMapper } from '@src/modules/user/adapters/http/mappers/list-user.mapper';

@ApiTags('Users')
@ApiBearerAuth('JWT')
@Controller('users')
export class ListUserController {
  constructor(
    @Inject(LIST_USER_USE_CASE)
    private readonly listUserUseCase: ListUserUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'List users',
    description: 'Returns the list of users.',
  })
  @ApiOkResponse({
    description: 'Users listed successfully.',
    type: ListUserResponseDto,
    isArray: true,
  })
  @Get()
  async handle(
    @Query() query: ListUserQueryDto,
  ): Promise<ListUserResponseDto[]> {
    const result = await this.listUserUseCase.execute({
      page: query.page ? Number(query.page) : undefined,
      limit: query.limit ? Number(query.limit) : undefined,
      search: query.search,
      status: query.status,
    });

    return result.map((user) => ListUserMapper.toResponse(user));
  }
}
