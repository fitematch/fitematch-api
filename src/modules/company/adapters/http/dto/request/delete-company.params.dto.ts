import { IsString } from 'class-validator';

export class DeleteCompanyParamsDto {
  @IsString()
  id!: string;
}
