import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CREATE_MY_COMPANY_REPOSITORY } from '@src/modules/company/application/contracts/tokens/company.tokens';
import type { CreateMyCompanyUseCaseInterface } from '@src/modules/company/application/contracts/use-cases/create-my-company.use-case.interface';
import type { CreateMyCompanyRepositoryInterface } from '@src/modules/company/application/contracts/repositories/create-my-company.repository.interface';
import type { CreateMyCompanyInputDto } from '@src/modules/company/application/dto/input/create-my-company.input.dto';
import type { CreateMyCompanyOutputDto } from '@src/modules/company/application/dto/output/create-my-company.output.dto';
import { CnpjUtils } from '@src/shared/utils/cnpj.utils';
import { SlugUtils } from '@src/shared/utils/slug.utils';

@Injectable()
export class CreateMyCompanyUseCase implements CreateMyCompanyUseCaseInterface {
  private readonly cnpjUtils = new CnpjUtils();

  constructor(
    @Inject(CREATE_MY_COMPANY_REPOSITORY)
    private readonly createMyCompanyRepository: CreateMyCompanyRepositoryInterface,
  ) {}

  async execute(
    input: CreateMyCompanyInputDto,
  ): Promise<CreateMyCompanyOutputDto> {
    if (
      await this.createMyCompanyRepository.existsByCreatedByUserId(input.userId)
    ) {
      throw new ConflictException(
        'Authenticated recruiter already has a company.',
      );
    }

    const normalizedCnpj = this.cnpjUtils.normalize(input.documents.cnpj);

    if (normalizedCnpj && !this.cnpjUtils.isValid(normalizedCnpj)) {
      throw new BadRequestException('Invalid CNPJ.');
    }

    if (
      normalizedCnpj &&
      (await this.createMyCompanyRepository.existsByCnpj(normalizedCnpj))
    ) {
      throw new ConflictException('Company with this CNPJ already exists.');
    }

    const requestedSlug = SlugUtils.generate(input.slug ?? '');
    const baseSlug = requestedSlug || SlugUtils.generate(input.tradeName);
    const slug = await this.generateUniqueSlug(baseSlug);

    return this.createMyCompanyRepository.create({
      ...input,
      slug,
      documents: {
        ...input.documents,
        cnpj: normalizedCnpj,
      },
    });
  }

  private async generateUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (await this.createMyCompanyRepository.existsBySlug(slug)) {
      slug = SlugUtils.generateWithSuffix(baseSlug, counter);
      counter++;
    }

    return slug;
  }
}
