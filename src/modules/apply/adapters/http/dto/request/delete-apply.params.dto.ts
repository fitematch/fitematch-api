import { IsString } from 'class-validator';

export class DeleteApplyParamsDto {
  @IsString()
  id!: string;
}
