import { ConflictException, Inject, Injectable } from '@nestjs/common';
import type { CreateJobUseCaseInterface } from '@src/modules/job/application/contracts/use-cases/create-job.use-case.interface';
import type { CreateJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/create-job.repository.interface';
import { CREATE_JOB_REPOSITORY } from '@src/modules/job/application/contracts/tokens/job.tokens';
import { CreateJobInputDto } from '@src/modules/job/application/dto/input/create-job.input.dto';
import { CreateJobOutputDto } from '@src/modules/job/application/dto/output/create-job.output.dto';
import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';
import { SlugUtils } from '@src/shared/utils/slug.utils';

@Injectable()
export class CreateJobUseCase implements CreateJobUseCaseInterface {
  constructor(
    @Inject(CREATE_JOB_REPOSITORY)
    private readonly createJobRepository: CreateJobRepositoryInterface,
  ) {}

  async execute(input: CreateJobInputDto): Promise<CreateJobOutputDto> {
    const hasDuplicate = await this.createJobRepository.existsDuplicate(
      input.companyId,
      input.title,
      [JobStatusEnum.PENDING, JobStatusEnum.ACTIVE],
    );

    if (hasDuplicate) {
      throw new ConflictException(
        'A job with the same title already exists for this company.',
      );
    }

    const requestedSlug = SlugUtils.generate(input.slug ?? '');
    const baseSlug =
      requestedSlug ||
      (await this.buildDefaultSlug(input.companyId, input.title));
    const slug = await this.generateUniqueSlug(baseSlug);

    return this.createJobRepository.create({
      ...input,
      slug,
      status: input.status ?? JobStatusEnum.PENDING,
    });
  }

  private async generateUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (await this.createJobRepository.existsBySlug(slug)) {
      slug = SlugUtils.generateWithSuffix(baseSlug, counter);
      counter++;
    }

    return slug;
  }

  private async buildDefaultSlug(
    companyId: string,
    title: string,
  ): Promise<string> {
    const company =
      await this.createJobRepository.findCompanySlugContext(companyId);

    return SlugUtils.generate(
      [title, company?.tradeName, company?.city, company?.state]
        .filter(Boolean)
        .join(' '),
    );
  }
}
