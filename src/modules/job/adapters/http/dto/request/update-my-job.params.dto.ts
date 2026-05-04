import { IsString } from 'class-validator';

export class UpdateMyJobParamsDto {
  @IsString()
  jobId!: string;
}
