import { CreateJobMapper } from '@src/modules/job/adapters/http/mappers/create-job.mapper';
import { ListJobMapper } from '@src/modules/job/adapters/http/mappers/list-job.mapper';
import { ReadJobMapper } from '@src/modules/job/adapters/http/mappers/read-job.mapper';
import { UpdateJobMapper } from '@src/modules/job/adapters/http/mappers/update-job.mapper';
import type { CreateJobOutputDto } from '@src/modules/job/application/dto/output/create-job.output.dto';
import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';

const job: CreateJobOutputDto = {
  _id: 'job-1',
  slug: 'personal-trainer',
  companyId: 'company-1',
  title: 'Personal Trainer',
  description: 'Responsible for training clients.',
  slots: 2,
  benefits: {
    salary: 3500,
    healthInsurance: true,
  },
  status: JobStatusEnum.ACTIVE,
};

describe('Job Mappers', () => {
  it('should format salary in create mapper', () => {
    const result = CreateJobMapper.toResponse(job);

    expect(result.benefits?.salary).toBe('R$\u00a03.500,00');
  });

  it('should format salary in list mapper', () => {
    const result = ListJobMapper.toResponse(job);

    expect(result.benefits?.salary).toBe('R$\u00a03.500,00');
  });

  it('should format salary in read mapper', () => {
    const result = ReadJobMapper.toResponse(job);

    expect(result.benefits?.salary).toBe('R$\u00a03.500,00');
  });

  it('should format salary in update mapper', () => {
    const result = UpdateJobMapper.toResponse(job);

    expect((result.benefits as { salary?: string } | undefined)?.salary).toBe(
      'R$\u00a03.500,00',
    );
  });
});
