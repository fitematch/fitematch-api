import { ApplicationStatusEnum } from '@src/modules/apply/domain/enums/application-status.enum';

export class UpdateApplyInputDto {
  _id!: string;
  status?: ApplicationStatusEnum;
}
