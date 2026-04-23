import { IsString } from 'class-validator';

export class UpdateUserParamsDto {
  @IsString()
  userId!: string;
}
