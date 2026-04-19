import { IsString } from 'class-validator';

export class UpdateApplyParamsDto {
  @IsString()
  id!: string;
}
