import { IsString } from 'class-validator';

export class UpdateJobParamsDto {
  @IsString()
  jobId!: string;
}
