import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { CreateApplyUseCaseInterface } from '@src/modules/apply/application/contracts/use-cases/create-apply.use-case.interface';
import { CREATE_APPLY_USE_CASE } from '@src/modules/apply/application/contracts/tokens/apply.tokens';
import { CreateApplyRequestDto } from '@src/modules/apply/adapters/http/dto/request/create-apply.request.dto';
import { CreateApplyResponseDto } from '@src/modules/apply/adapters/http/dto/response/create-apply.response.dto';
import { CreateApplyMapper } from '@src/modules/apply/adapters/http/mappers/create-apply.mapper';
import { CreateApplyRequestMapper } from '@src/modules/apply/adapters/http/mappers/create-apply-request.mapper';

@ApiTags('Apply')
@ApiBearerAuth('JWT')
@Controller('apply')
export class CreateApplyController {
  constructor(
    @Inject(CREATE_APPLY_USE_CASE)
    private readonly createApplyUseCase: CreateApplyUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Create a new job application',
    description: 'Creates a new job application.',
  })
  @ApiCreatedResponse({
    description: 'Job application created successfully.',
    type: CreateApplyResponseDto,
  })
  @ApiConflictResponse({
    description: 'User already applied to this job.',
  })
  @Post()
  async handle(
    @Body() body: CreateApplyRequestDto,
  ): Promise<CreateApplyResponseDto> {
    const result = await this.createApplyUseCase.execute(
      CreateApplyRequestMapper.toInput(body),
    );

    return CreateApplyMapper.toResponse(result);
  }
}
