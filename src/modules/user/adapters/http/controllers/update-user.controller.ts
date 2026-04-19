import {
  Body,
  Controller,
  Inject,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { UpdateUserUseCaseInterface } from '@src/modules/user/application/contracts/use-cases/update-user.use-case.interface';
import { UPDATE_USER_USE_CASE } from '@src/modules/user/application/contracts/tokens/user.tokens';
import { UpdateUserParamsDto } from '@src/modules/user/adapters/http/dto/request/update-user.params.dto';
import { UpdateUserRequestDto } from '@src/modules/user/adapters/http/dto/request/update-user.request.dto';
import { UpdateUserResponseDto } from '@src/modules/user/adapters/http/dto/response/update-user.response.dto';
import { UpdateUserRequestMapper } from '@src/modules/user/adapters/http/mappers/update-user-request.mapper';
import { UpdateUserMapper } from '@src/modules/user/adapters/http/mappers/update-user.mapper';

@ApiTags('User')
@ApiBearerAuth('JWT')
@Controller('user')
export class UpdateUserController {
  constructor(
    @Inject(UPDATE_USER_USE_CASE)
    private readonly updateUserUseCase: UpdateUserUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Update one user',
    description: 'Updates a user by ID.',
  })
  @ApiOkResponse({
    description: 'User updated successfully.',
    type: UpdateUserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found!',
  })
  @Patch(':id')
  async handle(
    @Param() params: UpdateUserParamsDto,
    @Body() body: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    const result = await this.updateUserUseCase.execute(
      UpdateUserRequestMapper.toInput(params, body),
    );

    if (!result) {
      throw new NotFoundException('User not found.');
    }

    return UpdateUserMapper.toResponse(result);
  }
}
