import { IsString } from 'class-validator';

export class ReadJobParamsDto {
  @IsString()
  jobId!: string;
}
