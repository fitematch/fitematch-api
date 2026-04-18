import { Inject, Injectable } from '@nestjs/common';
import type { UpdateCompanyUseCaseInterface } from '@src/modules/company/application/contracts/use-cases/update-company.use-case.interface';
import type { UpdateCompanyRepositoryInterface } from '@src/modules/company/application/contracts/repositories/update-company.repository.interface';
import { UPDATE_COMPANY_REPOSITORY } from '@src/modules/company/application/contracts/tokens/company.tokens';
import type { UpdateCompanyInputDto } from '@src/modules/company/application/dto/input/update-company.input.dto';
import type { UpdateCompanyOutputDto } from '@src/modules/company/application/dto/output/update-company.output.dto';

@Injectable()
export class UpdateCompanyUseCase implements UpdateCompanyUseCaseInterface {
  constructor(
    @Inject(UPDATE_COMPANY_REPOSITORY)
    private readonly updateCompanyRepository: UpdateCompanyRepositoryInterface,
  ) {}

  async execute(
    input: UpdateCompanyInputDto,
  ): Promise<UpdateCompanyOutputDto | null> {
    return this.updateCompanyRepository.update(input);
  }
}
