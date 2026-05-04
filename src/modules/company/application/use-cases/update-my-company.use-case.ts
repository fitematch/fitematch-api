import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UPDATE_MY_COMPANY_REPOSITORY } from '@src/modules/company/application/contracts/tokens/company.tokens';
import type { UpdateMyCompanyUseCaseInterface } from '@src/modules/company/application/contracts/use-cases/update-my-company.use-case.interface';
import type { UpdateMyCompanyRepositoryInterface } from '@src/modules/company/application/contracts/repositories/update-my-company.repository.interface';
import type { UpdateMyCompanyInputDto } from '@src/modules/company/application/dto/input/update-my-company.input.dto';
import type { UpdateMyCompanyOutputDto } from '@src/modules/company/application/dto/output/update-my-company.output.dto';
import { CnpjUtils } from '@src/shared/utils/cnpj.utils';

@Injectable()
export class UpdateMyCompanyUseCase implements UpdateMyCompanyUseCaseInterface {
  private readonly cnpjUtils = new CnpjUtils();

  constructor(
    @Inject(UPDATE_MY_COMPANY_REPOSITORY)
    private readonly updateMyCompanyRepository: UpdateMyCompanyRepositoryInterface,
  ) {}

  async execute(
    input: UpdateMyCompanyInputDto,
  ): Promise<UpdateMyCompanyOutputDto | null> {
    const cnpj = input.documents?.cnpj;

    if (cnpj) {
      const normalizedCnpj = this.cnpjUtils.normalize(cnpj);

      if (!this.cnpjUtils.isValid(normalizedCnpj)) {
        throw new BadRequestException('Invalid CNPJ.');
      }

      input.documents = {
        ...input.documents,
        cnpj: normalizedCnpj,
      };
    }

    return this.updateMyCompanyRepository.update(input);
  }
}
