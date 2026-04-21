import { IsString } from 'class-validator';

export class ReadJobParamsDto {
  @IsString()
  _id!: string;
}
