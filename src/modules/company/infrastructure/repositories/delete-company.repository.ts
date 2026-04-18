import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { DeleteCompanyRepositoryInterface } from '@src/modules/company/application/contracts/repositories/delete-company.repository.interface';
import type { DeleteCompanyInputDto } from '@src/modules/company/application/dto/input/delete-company.input.dto';
import {
  CompanySchema,
  type CompanyDocument,
} from '@src/modules/company/infrastructure/database/mongoose/schemas/company.schema';

@Injectable()
export class DeleteCompanyRepository implements DeleteCompanyRepositoryInterface {
  constructor(
    @InjectModel(CompanySchema.name)
    private readonly companyModel: Model<CompanyDocument>,
  ) {}

  async delete(input: DeleteCompanyInputDto): Promise<boolean> {
    const deletedCompany = await this.companyModel
      .findByIdAndDelete(input.id)
      .lean()
      .exec();

    return !!deletedCompany;
  }
}
