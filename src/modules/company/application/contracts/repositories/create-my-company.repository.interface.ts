import { CreateMyCompanyInputDto } from '@src/modules/company/application/dto/input/create-my-company.input.dto';
import { CreateMyCompanyOutputDto } from '@src/modules/company/application/dto/output/create-my-company.output.dto';

export interface CreateMyCompanyRepositoryInterface {
  existsBySlug(slug: string): Promise<boolean>;
  existsByCnpj(cnpj: string): Promise<boolean>;
  existsByCreatedByUserId(userId: string): Promise<boolean>;
  create(input: CreateMyCompanyInputDto): Promise<CreateMyCompanyOutputDto>;
}
