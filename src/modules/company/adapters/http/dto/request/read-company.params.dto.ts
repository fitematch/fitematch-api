import { IsString } from 'class-validator';

export class ReadCompanyParamsDto {
  @IsString()
  _id!: string;
}
