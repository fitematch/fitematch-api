import { IsString } from 'class-validator';

export class DeleteUserParamsDto {
  @IsString()
  userId!: string;
}
