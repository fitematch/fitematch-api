import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  CandidateProfileRequestDto,
  RecruiterProfileRequestDto,
} from '@src/modules/user/adapters/http/dto/request/update-user.request.dto';

export class UpdateMeRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  birthday?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CandidateProfileRequestDto)
  candidateProfile?: CandidateProfileRequestDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => RecruiterProfileRequestDto)
  recruiterProfile?: RecruiterProfileRequestDto;
}
