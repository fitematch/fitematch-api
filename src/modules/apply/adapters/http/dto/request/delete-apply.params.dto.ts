import { IsString } from 'class-validator';

export class DeleteApplyParamsDto {
  @IsString()
  _id!: string;
}
