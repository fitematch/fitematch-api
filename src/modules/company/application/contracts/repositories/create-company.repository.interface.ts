import { CreateCompanyInputDto } from '@src/modules/company/application/dto/input/create-company.input.dto';
import { CreateCompanyOutputDto } from '@src/modules/company/application/dto/output/create-company.output.dto';

export interface CreateCompanyRepositoryInterface {
  existsBySlug(slug: string): Promise<boolean>;
  existsByCnpj(cnpj: string): Promise<boolean>;
  create(input: CreateCompanyInputDto): Promise<CreateCompanyOutputDto>;
}
