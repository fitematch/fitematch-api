import { IsString } from 'class-validator';

export class ReadApplyParamsDto {
  @IsString()
  id!: string;
}
