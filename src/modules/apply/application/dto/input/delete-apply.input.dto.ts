import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';

export class DeleteApplyInputDto {
  _id!: string;
  userId!: string;
  productRole!: ProductRoleEnum;
}
