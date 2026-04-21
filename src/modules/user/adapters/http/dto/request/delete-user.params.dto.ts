import { IsString } from 'class-validator';

export class DeleteUserParamsDto {
  @IsString()
  _id!: string;
}
