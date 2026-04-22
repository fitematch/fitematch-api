import { ApiProperty } from '@nestjs/swagger';

export class CreateActivationCodeRequestDto {
  @ApiProperty()
  email!: string;
}
