import { ApiProperty } from '@nestjs/swagger';

export class UploadFileResponseDto {
  @ApiProperty({
    example:
      '/uploads/logos/69f147a328aa01a9f66f1354/bluefit-logo-1710000000000.png',
  })
  url!: string;
}
