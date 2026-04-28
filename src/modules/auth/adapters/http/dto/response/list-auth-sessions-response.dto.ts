import { ApiProperty } from '@nestjs/swagger';

export class ListAuthSessionsResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty({ required: false })
  userAgent?: string;

  @ApiProperty({ required: false })
  ipAddress?: string;

  @ApiProperty()
  expiresAt!: Date;

  @ApiProperty({ required: false })
  revokedAt?: Date;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;
}
