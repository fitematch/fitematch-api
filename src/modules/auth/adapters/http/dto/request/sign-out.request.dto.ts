import { ApiProperty } from '@nestjs/swagger';

export class SignOutRequestDto {
  @ApiProperty()
  refreshToken!: string;
}
