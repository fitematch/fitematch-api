import {
  Body,
  Controller,
  Inject,
  NotFoundException,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UPDATE_ME_USE_CASE } from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { UpdateMeUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/update-me.use-case.interface';
import { UpdateMeRequestDto } from '@src/modules/auth/adapters/http/dto/request/update-me.request.dto';
import { UpdateMeResponseDto } from '@src/modules/auth/adapters/http/dto/response/update-me.response.dto';
import { UpdateMeRequestMapper } from '@src/modules/auth/adapters/http/mappers/update-me-request.mapper';
import { UpdateMeMapper } from '@src/modules/auth/adapters/http/mappers/update-me.mapper';
import { JwtAuthGuard } from '@src/modules/auth/adapters/http/guards/jwt-auth.guard';
import { CurrentUser } from '@src/modules/auth/adapters/http/decorators/current-user.decorator';
import type { JwtPayloadType } from '@src/modules/auth/domain/types/jwt-payload.type';

@ApiTags('Auth')
@ApiBearerAuth('JWT')
@Controller('auth')
export class UpdateMeController {
  constructor(
    @Inject(UPDATE_ME_USE_CASE)
    private readonly updateMeUseCase: UpdateMeUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Update authenticated user',
    description: 'Updates the authenticated user profile.',
  })
  @ApiOkResponse({
    description: 'Authenticated user updated successfully.',
    type: UpdateMeResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Authenticated user not found.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  public async handle(
    @CurrentUser() user: JwtPayloadType,
    @Body() body: UpdateMeRequestDto,
  ): Promise<UpdateMeResponseDto> {
    const result = await this.updateMeUseCase.execute(
      UpdateMeRequestMapper.toInput(user, body),
    );

    if (!result) {
      throw new NotFoundException('Authenticated user not found.');
    }

    return UpdateMeMapper.toResponse(result);
  }
}
