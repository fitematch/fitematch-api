import { IsString } from 'class-validator';

export class UpdateApplyParamsDto {
  @IsString()
  applyId!: string;
}
