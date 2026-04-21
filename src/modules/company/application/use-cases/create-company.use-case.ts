import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import type { CreateCompanyUseCaseInterface } from '@src/modules/company/application/contracts/use-cases/create-company.use-case.interface';
import type { CreateCompanyRepositoryInterface } from '@src/modules/company/application/contracts/repositories/create-company.repository.interface';
import { CREATE_COMPANY_REPOSITORY } from '@src/modules/company/application/contracts/tokens/company.tokens';
import { CreateCompanyInputDto } from '@src/modules/company/application/dto/input/create-company.input.dto';
import { CreateCompanyOutputDto } from '@src/modules/company/application/dto/output/create-company.output.dto';
import { CompanyStatusEnum } from '@src/modules/company/domain/enums/company-status.enum';
import { CnpjUtils } from '@src/shared/utils/cnpj.utils';
import { SlugUtils } from '@src/shared/utils/slug.utils';

@Injectable()
export class CreateCompanyUseCase implements CreateCompanyUseCaseInterface {
  private readonly cnpjUtils = new CnpjUtils();

  constructor(
    @Inject(CREATE_COMPANY_REPOSITORY)
    private readonly createCompanyRepository: CreateCompanyRepositoryInterface,
  ) {}

  async execute(input: CreateCompanyInputDto): Promise<CreateCompanyOutputDto> {
    const normalizedCnpj = this.cnpjUtils.normalize(input.documents.cnpj);

    if (normalizedCnpj && !this.cnpjUtils.isValid(normalizedCnpj)) {
      throw new BadRequestException('Invalid CNPJ.');
    }

    if (
      normalizedCnpj &&
      (await this.createCompanyRepository.existsByCnpj(normalizedCnpj))
    ) {
      throw new ConflictException('Company with this CNPJ already exists.');
    }

    const requestedSlug = SlugUtils.generate(input.slug ?? '');
    const baseSlug = requestedSlug || SlugUtils.generate(input.tradeName);
    const slug = await this.generateUniqueSlug(baseSlug);

    return this.createCompanyRepository.create({
      ...input,
      documents: {
        ...input.documents,
        cnpj: normalizedCnpj,
      },
      slug,
      status: input.status ?? CompanyStatusEnum.PENDING,
    });
  }

  private async generateUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (await this.createCompanyRepository.existsBySlug(slug)) {
      slug = SlugUtils.generateWithSuffix(baseSlug, counter);
      counter++;
    }

    return slug;
  }
}
