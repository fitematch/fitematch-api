import { IsString } from 'class-validator';

export class ReadUserParamsDto {
  @IsString()
  _id!: string;
}
