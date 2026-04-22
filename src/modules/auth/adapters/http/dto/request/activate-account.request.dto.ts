import { ApiProperty } from '@nestjs/swagger';

export class ActivateAccountRequestDto {
  @ApiProperty()
  email!: string;

  @ApiProperty()
  code!: string;
}
