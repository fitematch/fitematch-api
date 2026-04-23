import { IsString } from 'class-validator';

export class ReadUserParamsDto {
  @IsString()
  userId!: string;
}
