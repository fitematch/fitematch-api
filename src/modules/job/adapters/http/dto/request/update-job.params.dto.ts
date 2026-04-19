import { IsString } from 'class-validator';

export class UpdateJobParamsDto {
  @IsString()
  id!: string;
}
