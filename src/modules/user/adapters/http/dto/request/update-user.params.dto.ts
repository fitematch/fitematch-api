import { IsString } from 'class-validator';

export class UpdateUserParamsDto {
  @IsString()
  _id!: string;
}
