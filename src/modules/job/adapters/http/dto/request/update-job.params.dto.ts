import { IsString } from 'class-validator';

export class UpdateJobParamsDto {
  @IsString()
  _id!: string;
}
