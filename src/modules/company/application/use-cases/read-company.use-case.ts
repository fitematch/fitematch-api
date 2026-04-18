import { Inject, Injectable } from '@nestjs/common';
import type { ReadCompanyUseCaseInterface } from '@src/modules/company/application/contracts/use-cases/read-company.use-case.interface';
import type { ReadCompanyRepositoryInterface } from '@src/modules/company/application/contracts/repositories/read-company.repository.interface';
import { READ_COMPANY_REPOSITORY } from '@src/modules/company/application/contracts/tokens/company.tokens';
import type { ReadCompanyInputDto } from '@src/modules/company/application/dto/input/read-company.input.dto';
import type { ReadCompanyOutputDto } from '@src/modules/company/application/dto/output/read-company.output.dto';

@Injectable()
export class ReadCompanyUseCase implements ReadCompanyUseCaseInterface {
  constructor(
    @Inject(READ_COMPANY_REPOSITORY)
    private readonly readCompanyRepository: ReadCompanyRepositoryInterface,
  ) {}

  async execute(
    input: ReadCompanyInputDto,
  ): Promise<ReadCompanyOutputDto | null> {
    return this.readCompanyRepository.read(input);
  }
}
