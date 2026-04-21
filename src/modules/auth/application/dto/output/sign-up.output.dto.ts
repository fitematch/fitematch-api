import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';

export class SignUpOutputDto {
  id!: string;
  name!: string;
  email!: string;
  birthday!: string;
  productRole!: ProductRoleEnum;
  status!: string;
  createdAt?: Date;
  updatedAt?: Date;
}
