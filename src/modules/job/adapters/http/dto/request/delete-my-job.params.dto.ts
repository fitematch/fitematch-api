import { IsString } from 'class-validator';

export class DeleteMyJobParamsDto {
  @IsString()
  jobId!: string;
}
