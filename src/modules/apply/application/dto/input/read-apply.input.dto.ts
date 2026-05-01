import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';

export class ReadApplyInputDto {
  _id!: string;
  userId!: string;
  productRole!: ProductRoleEnum;
  recruiterCompanyId?: string;
}
