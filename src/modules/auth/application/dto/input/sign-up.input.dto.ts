import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';

export class SignUpInputDto {
  name!: string;
  email!: string;
  password!: string;
  birthday!: string;
  productRole!: ProductRoleEnum.CANDIDATE | ProductRoleEnum.RECRUITER;
}
