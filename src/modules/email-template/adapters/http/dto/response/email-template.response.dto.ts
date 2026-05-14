import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EmailTemplateVariableResponseDto {
  @ApiProperty()
  key!: string;

  @ApiProperty()
  description!: string;
}

export class EmailTemplateResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  subject!: string;

  @ApiProperty()
  preheader!: string;

  @ApiProperty()
  body!: string;

  @ApiProperty()
  defaultSubject!: string;

  @ApiProperty()
  defaultPreheader!: string;

  @ApiProperty()
  defaultBody!: string;

  @ApiProperty({ type: EmailTemplateVariableResponseDto, isArray: true })
  variables!: EmailTemplateVariableResponseDto[];

  @ApiProperty()
  isSystem!: boolean;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
