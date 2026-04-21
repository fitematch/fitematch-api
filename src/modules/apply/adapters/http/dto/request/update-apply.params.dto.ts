import { IsString } from 'class-validator';

export class UpdateApplyParamsDto {
  @IsString()
  _id!: string;
}
