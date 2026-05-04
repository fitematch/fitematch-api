import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CREATE_MY_JOB_USE_CASE } from '@src/modules/job/application/contracts/tokens/job.tokens';
import type { CreateMyJobUseCaseInterface } from '@src/modules/job/application/contracts/use-cases/create-my-job.use-case.interface';
import type { CreateMyJobRequestDto } from '@src/modules/job/adapters/http/dto/request/create-my-job.request.dto';
import { CreateMyJobResponseDto } from '@src/modules/job/adapters/http/dto/response/create-my-job.response.dto';
import { CreateMyJobRequestMapper } from '@src/modules/job/adapters/http/mappers/create-my-job-request.mapper';
import { CreateMyJobMapper } from '@src/modules/job/adapters/http/mappers/create-my-job.mapper';
import { JwtAuthGuard } from '@src/modules/auth/adapters/http/guards/jwt-auth.guard';
import { ProductRoleGuard } from '@src/modules/auth/adapters/http/guards/product-role.guard';
import { ProductRoles } from '@src/modules/auth/adapters/http/decorators/product-roles.decorator';
import { CurrentUser } from '@src/modules/auth/adapters/http/decorators/current-user.decorator';
import type { AuthUserPayload } from '@src/modules/auth/application/dto/auth-user-payload';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';

@ApiTags('Job')
@Controller('job')
export class CreateMyJobController {
  constructor(
    @Inject(CREATE_MY_JOB_USE_CASE)
    private readonly createMyJobUseCase: CreateMyJobUseCaseInterface,
  ) {}

  @Post('me')
  @UseGuards(JwtAuthGuard, ProductRoleGuard)
  @ProductRoles(ProductRoleEnum.RECRUITER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create authenticated recruiter job' })
  @ApiCreatedResponse({ type: CreateMyJobResponseDto })
  async handle(
    @CurrentUser() user: AuthUserPayload,
    @Body() body: CreateMyJobRequestDto,
  ): Promise<CreateMyJobResponseDto> {
    const output = await this.createMyJobUseCase.execute(
      CreateMyJobRequestMapper.toInput(user, body),
    );

    return CreateMyJobMapper.toResponse(output);
  }
}
