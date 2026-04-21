import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import type { DeleteUserUseCaseInterface } from '@src/modules/user/application/contracts/use-cases/delete-user.use-case.interface';
import { DELETE_USER_USE_CASE } from '@src/modules/user/application/contracts/tokens/user.tokens';
import { DeleteUserParamsDto } from '@src/modules/user/adapters/http/dto/request/delete-user.params.dto';
import { DeleteUserRequestMapper } from '@src/modules/user/adapters/http/mappers/delete-user-request.mapper';

@ApiTags('User')
@ApiBearerAuth('JWT')
@Controller('user')
export class DeleteUserController {
  constructor(
    @Inject(DELETE_USER_USE_CASE)
    private readonly deleteUserUseCase: DeleteUserUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Delete one user',
    description: 'Deletes one user by ID.',
  })
  @ApiNoContentResponse({
    description: 'User deleted successfully.',
  })
  @ApiNotFoundResponse({
    description: 'User not found!',
  })
  @Delete(':_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(@Param() params: DeleteUserParamsDto): Promise<void> {
    const deleted = await this.deleteUserUseCase.execute(
      DeleteUserRequestMapper.toInput(params),
    );

    if (!deleted) {
      throw new NotFoundException('User not found.');
    }
  }
}
