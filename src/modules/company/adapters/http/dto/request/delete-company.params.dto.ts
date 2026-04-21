import { IsString } from 'class-validator';

export class DeleteCompanyParamsDto {
  @IsString()
  _id!: string;
}
