import {
  Body,
  Controller,
  Inject,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UPDATE_MY_JOB_USE_CASE } from '@src/modules/job/application/contracts/tokens/job.tokens';
import type { UpdateMyJobUseCaseInterface } from '@src/modules/job/application/contracts/use-cases/update-my-job.use-case.interface';
import { UpdateMyJobParamsDto } from '@src/modules/job/adapters/http/dto/request/update-my-job.params.dto';
import { UpdateMyJobRequestDto } from '@src/modules/job/adapters/http/dto/request/update-my-job.request.dto';
import { UpdateMyJobResponseDto } from '@src/modules/job/adapters/http/dto/response/update-my-job.response.dto';
import { UpdateMyJobRequestMapper } from '@src/modules/job/adapters/http/mappers/update-my-job-request.mapper';
import { UpdateMyJobMapper } from '@src/modules/job/adapters/http/mappers/update-my-job.mapper';
import { JwtAuthGuard } from '@src/modules/auth/adapters/http/guards/jwt-auth.guard';
import { ProductRoleGuard } from '@src/modules/auth/adapters/http/guards/product-role.guard';
import { ProductRoles } from '@src/modules/auth/adapters/http/decorators/product-roles.decorator';
import { CurrentUser } from '@src/modules/auth/adapters/http/decorators/current-user.decorator';
import type { AuthUserPayload } from '@src/modules/auth/application/dto/auth-user-payload';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';

@ApiTags('Job')
@Controller('job')
export class UpdateMyJobController {
  constructor(
    @Inject(UPDATE_MY_JOB_USE_CASE)
    private readonly updateMyJobUseCase: UpdateMyJobUseCaseInterface,
  ) {}

  @Patch('me/:jobId')
  @UseGuards(JwtAuthGuard, ProductRoleGuard)
  @ProductRoles(ProductRoleEnum.RECRUITER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update authenticated recruiter job' })
  @ApiParam({ name: 'jobId', type: String })
  @ApiOkResponse({ type: UpdateMyJobResponseDto })
  async handle(
    @CurrentUser() user: AuthUserPayload,
    @Param() params: UpdateMyJobParamsDto,
    @Body() body: UpdateMyJobRequestDto,
  ): Promise<UpdateMyJobResponseDto> {
    const output = await this.updateMyJobUseCase.execute(
      UpdateMyJobRequestMapper.toInput(user, params, body),
    );

    return UpdateMyJobMapper.toResponse(output);
  }
}
