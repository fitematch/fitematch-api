import { Inject, Injectable } from '@nestjs/common';
import type { DeleteCompanyUseCaseInterface } from '@src/modules/company/application/contracts/use-cases/delete-company.use-case.interface';
import type { DeleteCompanyRepositoryInterface } from '@src/modules/company/application/contracts/repositories/delete-company.repository.interface';
import { DELETE_COMPANY_REPOSITORY } from '@src/modules/company/application/contracts/tokens/company.tokens';
import type { DeleteCompanyInputDto } from '@src/modules/company/application/dto/input/delete-company.input.dto';

@Injectable()
export class DeleteCompanyUseCase implements DeleteCompanyUseCaseInterface {
  constructor(
    @Inject(DELETE_COMPANY_REPOSITORY)
    private readonly deleteCompanyRepository: DeleteCompanyRepositoryInterface,
  ) {}

  async execute(input: DeleteCompanyInputDto): Promise<boolean> {
    return this.deleteCompanyRepository.delete(input);
  }
}
