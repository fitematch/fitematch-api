import { IsString } from 'class-validator';

export class UpdateCompanyParamsDto {
  @IsString()
  _id!: string;
}
