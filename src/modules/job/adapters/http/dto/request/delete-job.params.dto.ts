import { IsString } from 'class-validator';

export class DeleteJobParamsDto {
  @IsString()
  id!: string;
}
