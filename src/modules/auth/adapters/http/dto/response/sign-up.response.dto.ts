import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';

export class SignUpResponseDto {
  id!: string;
  name!: string;
  email!: string;
  birthday!: string;
  productRole!: ProductRoleEnum;
  status!: string;
  createdAt?: Date;
  updatedAt?: Date;
}
