import { IsString } from 'class-validator';

export class ReadCompanyParamsDto {
  @IsString()
  id!: string;
}
