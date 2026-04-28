import { ApiProperty } from '@nestjs/swagger';

class PublicCompanyMediaDto {
  @ApiProperty({ required: false })
  logoUrl?: string;
}

export class ListPublicCompaniesResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  tradeName!: string;

  @ApiProperty({ required: false, type: PublicCompanyMediaDto })
  media?: PublicCompanyMediaDto;
}
