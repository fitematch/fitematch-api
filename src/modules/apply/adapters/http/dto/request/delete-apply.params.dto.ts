import { IsString } from 'class-validator';

export class DeleteApplyParamsDto {
  @IsString()
  applyId!: string;
}
