import { ApiProperty } from '@nestjs/swagger';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';

export class SignUpRequestDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  password!: string;

  @ApiProperty()
  birthday!: string;

  @ApiProperty({ enum: [ProductRoleEnum.CANDIDATE, ProductRoleEnum.RECRUITER] })
  productRole!: ProductRoleEnum.CANDIDATE | ProductRoleEnum.RECRUITER;
}
