import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ListCompanyRepositoryInterface } from '@src/modules/company/application/contracts/repositories/list-company.repository.interface';
import { ListCompanyInputDto } from '@src/modules/company/application/dto/input/list-company.input.dto';
import { ListCompanyRepositoryOutputDto } from '@src/modules/company/application/dto/output/list-company.repository-output.dto';
import {
  CompanyDocument,
  CompanySchema,
} from '@src/modules/company/infrastructure/database/mongoose/schemas/company.schema';

export class ListCompanyRepository implements ListCompanyRepositoryInterface {
  constructor(
    @InjectModel(CompanySchema.name)
    private readonly companyModel: Model<CompanyDocument>,
  ) {}

  async list(
    input: ListCompanyInputDto,
  ): Promise<ListCompanyRepositoryOutputDto[]> {
    const page = input.page && input.page > 0 ? input.page : 1;
    const limit = input.limit && input.limit > 0 ? input.limit : 10;

    const filters: Record<string, unknown> = {};

    if (input.status) {
      filters.status = input.status;
    }

    if (input.search) {
      filters.$or = [
        { tradeName: { $regex: input.search, $options: 'i' } },
        { legalName: { $regex: input.search, $options: 'i' } },
        { slug: { $regex: input.search, $options: 'i' } },
        { 'contacts.email': { $regex: input.search, $options: 'i' } },
      ];
    }

    const companies = await this.companyModel
      .find(filters)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<ListCompanyRepositoryOutputDto[]>()
      .exec();

    return companies;
  }
}
