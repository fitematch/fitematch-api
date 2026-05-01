import { ApplicationStatusEnum } from '@src/modules/apply/domain/enums/application-status.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';

export class UpdateApplyInputDto {
  _id!: string;
  status?: ApplicationStatusEnum;
  productRole!: ProductRoleEnum;
  recruiterCompanyId?: string;
}
