import { IsString } from 'class-validator';

export class ReadApplyParamsDto {
  @IsString()
  _id!: string;
}
