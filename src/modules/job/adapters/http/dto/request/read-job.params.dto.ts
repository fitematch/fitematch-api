import { IsString } from 'class-validator';

export class ReadJobParamsDto {
  @IsString()
  id!: string;
}
