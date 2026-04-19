import { Inject, Injectable } from '@nestjs/common';
import { READ_APPLY_REPOSITORY } from '@src/modules/apply/application/contracts/tokens/apply.tokens';
import type { ReadApplyUseCaseInterface } from '@src/modules/apply/application/contracts/use-cases/read-apply.use-case.interface';
import type { ReadApplyRepositoryInterface } from '@src/modules/apply/application/contracts/repositories/read-apply.repository.interface';
import type { ReadApplyInputDto } from '@src/modules/apply/application/dto/input/read-apply.input.dto';
import type { ReadApplyOutputDto } from '@src/modules/apply/application/dto/output/read-apply.output.dto';

@Injectable()
export class ReadApplyUseCase implements ReadApplyUseCaseInterface {
  constructor(
    @Inject(READ_APPLY_REPOSITORY)
    private readonly readApplyRepository: ReadApplyRepositoryInterface,
  ) {}

  async execute(input: ReadApplyInputDto): Promise<ReadApplyOutputDto | null> {
    return this.readApplyRepository.read(input);
  }
}
