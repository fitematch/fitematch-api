import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GET_ME_USE_CASE } from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { GetMeUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/get-me.use-case.interface';
import { GetMeResponseDto } from '@src/modules/auth/adapters/http/dto/response/get-me.response.dto';
import { GetMeMapper } from '@src/modules/auth/adapters/http/mappers/get-me.mapper';
import { JwtAuthGuard } from '@src/modules/auth/adapters/http/guards/jwt-auth.guard';
import { CurrentUser } from '@src/modules/auth/adapters/http/decorators/current-user.decorator';
import type { JwtPayloadType } from '@src/modules/auth/domain/types/jwt-payload.type';

@ApiTags('Auth')
@ApiBearerAuth('JWT')
@Controller('auth')
export class GetMeController {
  constructor(
    @Inject(GET_ME_USE_CASE)
    private readonly getMeUseCase: GetMeUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Get authenticated user',
    description: 'Returns the authenticated user profile.',
  })
  @ApiOkResponse({
    description: 'Authenticated user returned successfully.',
    type: GetMeResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Authenticated user not found.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  public async handle(
    @CurrentUser() user: JwtPayloadType,
  ): Promise<GetMeResponseDto> {
    const result = await this.getMeUseCase.execute({
      userId: user.sub,
    });

    if (!result) {
      throw new NotFoundException('Authenticated user not found.');
    }

    return GetMeMapper.toResponse(result);
  }
}
