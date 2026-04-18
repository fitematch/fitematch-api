import { Inject, Injectable } from '@nestjs/common';
import type { CreateCompanyUseCaseInterface } from '@src/modules/company/application/contracts/use-cases/create-company.use-case.interface';
import type { CreateCompanyRepositoryInterface } from '@src/modules/company/application/contracts/repositories/create-company.repository.interface';
import { CREATE_COMPANY_REPOSITORY } from '@src/modules/company/application/contracts/tokens/company.tokens';
import { CreateCompanyInputDto } from '@src/modules/company/application/dto/input/create-company.input.dto';
import { CreateCompanyOutputDto } from '@src/modules/company/application/dto/output/create-company.output.dto';
import { CompanyStatusEnum } from '@src/modules/company/domain/enums/company-status.enum';

@Injectable()
export class CreateCompanyUseCase implements CreateCompanyUseCaseInterface {
  constructor(
    @Inject(CREATE_COMPANY_REPOSITORY)
    private readonly createCompanyRepository: CreateCompanyRepositoryInterface,
  ) {}

  async execute(input: CreateCompanyInputDto): Promise<CreateCompanyOutputDto> {
    return this.createCompanyRepository.create({
      ...input,
      status: input.status ?? CompanyStatusEnum.PENDING,
    });
  }
}
