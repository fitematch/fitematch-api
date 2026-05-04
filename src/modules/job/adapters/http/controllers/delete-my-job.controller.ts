import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { DELETE_MY_JOB_USE_CASE } from '@src/modules/job/application/contracts/tokens/job.tokens';
import type { DeleteMyJobUseCaseInterface } from '@src/modules/job/application/contracts/use-cases/delete-my-job.use-case.interface';
import { DeleteMyJobParamsDto } from '@src/modules/job/adapters/http/dto/request/delete-my-job.params.dto';
import { DeleteMyJobRequestMapper } from '@src/modules/job/adapters/http/mappers/delete-my-job-request.mapper';
import { JwtAuthGuard } from '@src/modules/auth/adapters/http/guards/jwt-auth.guard';
import { ProductRoleGuard } from '@src/modules/auth/adapters/http/guards/product-role.guard';
import { ProductRoles } from '@src/modules/auth/adapters/http/decorators/product-roles.decorator';
import { CurrentUser } from '@src/modules/auth/adapters/http/decorators/current-user.decorator';
import type { AuthUserPayload } from '@src/modules/auth/application/dto/auth-user-payload';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';

@ApiTags('Job')
@Controller('job')
export class DeleteMyJobController {
  constructor(
    @Inject(DELETE_MY_JOB_USE_CASE)
    private readonly deleteMyJobUseCase: DeleteMyJobUseCaseInterface,
  ) {}

  @Delete('me/:jobId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, ProductRoleGuard)
  @ProductRoles(ProductRoleEnum.RECRUITER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete authenticated recruiter job' })
  @ApiParam({ name: 'jobId', type: String })
  @ApiNoContentResponse({ description: 'Job deleted successfully.' })
  async handle(
    @CurrentUser() user: AuthUserPayload,
    @Param() params: DeleteMyJobParamsDto,
  ): Promise<void> {
    await this.deleteMyJobUseCase.execute(
      DeleteMyJobRequestMapper.toInput(user, params),
    );
  }
}
