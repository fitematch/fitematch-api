import {
  CandidateProfileEntity,
  RecruiterProfileEntity,
} from '@src/modules/user/domain/entities/user.entity';

export class UpdateMeInputDto {
  userId!: string;
  name?: string;
  birthday?: string;
  candidateProfile?: CandidateProfileEntity;
  recruiterProfile?: RecruiterProfileEntity;
}
