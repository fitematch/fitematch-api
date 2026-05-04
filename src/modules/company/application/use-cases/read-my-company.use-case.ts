import { Inject, Injectable } from '@nestjs/common';
import { READ_MY_COMPANY_REPOSITORY } from '@src/modules/company/application/contracts/tokens/company.tokens';
import type { ReadMyCompanyUseCaseInterface } from '@src/modules/company/application/contracts/use-cases/read-my-company.use-case.interface';
import type { ReadMyCompanyRepositoryInterface } from '@src/modules/company/application/contracts/repositories/read-my-company.repository.interface';
import type { ReadMyCompanyInputDto } from '@src/modules/company/application/dto/input/read-my-company.input.dto';
import type { ReadMyCompanyOutputDto } from '@src/modules/company/application/dto/output/read-my-company.output.dto';

@Injectable()
export class ReadMyCompanyUseCase implements ReadMyCompanyUseCaseInterface {
  constructor(
    @Inject(READ_MY_COMPANY_REPOSITORY)
    private readonly readMyCompanyRepository: ReadMyCompanyRepositoryInterface,
  ) {}

  async execute(
    input: ReadMyCompanyInputDto,
  ): Promise<ReadMyCompanyOutputDto | null> {
    return this.readMyCompanyRepository.read(input);
  }
}
