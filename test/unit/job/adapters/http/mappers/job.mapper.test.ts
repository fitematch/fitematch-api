import { CreateJobMapper } from '@src/modules/job/adapters/http/mappers/create-job.mapper';
import { ListJobMapper } from '@src/modules/job/adapters/http/mappers/list-job.mapper';
import { ReadJobMapper } from '@src/modules/job/adapters/http/mappers/read-job.mapper';
import { UpdateJobMapper } from '@src/modules/job/adapters/http/mappers/update-job.mapper';
import type { CreateJobOutputDto } from '@src/modules/job/application/dto/output/create-job.output.dto';
import type { ListJobOutputDto } from '@src/modules/job/application/dto/output/list-job.output.dto';
import type { ReadJobOutputDto } from '@src/modules/job/application/dto/output/read-job.output.dto';
import { JobContractTypeEnum } from '@src/modules/job/domain/enums/job-contract-type.enum';
import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';

const createJob: CreateJobOutputDto = {
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
  contractType: JobContractTypeEnum.CLT,
  status: JobStatusEnum.ACTIVE,
};

const listJob: ListJobOutputDto = {
  ...createJob,
  company: {
    id: 'company-1',
    tradeName: 'Fitematch Gym',
    contacts: {
      email: 'contato@fitematch.com',
      website: 'https://fitematch.com',
      phone: {
        country: '+55',
        number: '11987654321',
        isWhatsapp: true,
        isTelegram: false,
      },
      address: {
        city: 'Sao Paulo',
        zipCode: '12345678',
      },
    },
    media: {
      logoUrl: 'https://cdn.example.com/company-logo.png',
    },
  },
};

const readJob: ReadJobOutputDto = {
  ...createJob,
  company: listJob.company,
};

describe('Job Mappers', () => {
  it('should format salary in create mapper', () => {
    const result = CreateJobMapper.toResponse(createJob);

    expect(result.benefits?.salary).toBe('R$\u00a03.500,00');
  });

  it('should format salary in list mapper', () => {
    const result = ListJobMapper.toResponse(listJob);

    expect(result.benefits?.salary).toBe('R$\u00a03.500,00');
    expect(result.company?.media?.logoUrl).toBe(
      'https://cdn.example.com/company-logo.png',
    );
    expect(result.company?.contacts?.phone?.number).toBe('(11) 98765-4321');
    expect(result.company?.contacts?.address?.zipCode).toBe('12345-678');
  });

  it('should format salary in read mapper', () => {
    const result = ReadJobMapper.toResponse(readJob);

    expect(result.benefits?.salary).toBe('R$\u00a03.500,00');
    expect(result.company?.contacts?.email).toBe('contato@fitematch.com');
    expect(result.company?.contacts?.phone?.number).toBe('(11) 98765-4321');
    expect(result.company?.contacts?.address?.zipCode).toBe('12345-678');
  });

  it('should format salary in update mapper', () => {
    const result = UpdateJobMapper.toResponse(createJob);

    expect((result.benefits as { salary?: string } | undefined)?.salary).toBe(
      'R$\u00a03.500,00',
    );
  });
});
