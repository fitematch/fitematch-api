import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EmailTemplateVariableResponseDto {
  @ApiProperty()
  key!: string;

  @ApiProperty()
  description!: string;
}

export class EmailTemplateResponseDto {
  @ApiProperty()
  slug!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional({ nullable: true })
  description?: string | null;

  @ApiProperty()
  subject!: string;

  @ApiPropertyOptional({ nullable: true })
  preheader?: string | null;

  @ApiProperty()
  body!: string;

  @ApiProperty()
  defaultSubject!: string;

  @ApiPropertyOptional({ nullable: true })
  defaultPreheader?: string | null;

  @ApiProperty()
  defaultBody!: string;

  @ApiProperty({ type: EmailTemplateVariableResponseDto, isArray: true })
  variables!: EmailTemplateVariableResponseDto[];

  @ApiProperty()
  isSystem!: boolean;

  @ApiProperty()
  isActive!: boolean;

  @ApiPropertyOptional({ nullable: true })
  category?: string | null;

  @ApiProperty()
  version!: number;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
