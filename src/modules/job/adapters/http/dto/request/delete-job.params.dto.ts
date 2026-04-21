import { IsString } from 'class-validator';

export class DeleteJobParamsDto {
  @IsString()
  _id!: string;
}
