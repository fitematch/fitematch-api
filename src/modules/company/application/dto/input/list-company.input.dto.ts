import { CompanyStatusEnum } from '@src/modules/company/domain/enums/company-status.enum';

export class ListCompanyInputDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: CompanyStatusEnum;
}
