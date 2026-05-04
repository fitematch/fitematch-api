import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CREATE_MY_JOB_REPOSITORY } from '@src/modules/job/application/contracts/tokens/job.tokens';
import type { CreateMyJobUseCaseInterface } from '@src/modules/job/application/contracts/use-cases/create-my-job.use-case.interface';
import type { CreateMyJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/create-my-job.repository.interface';
import type { CreateMyJobInputDto } from '@src/modules/job/application/dto/input/create-my-job.input.dto';
import type { CreateMyJobOutputDto } from '@src/modules/job/application/dto/output/create-my-job.output.dto';
import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';
import { SlugUtils } from '@src/shared/utils/slug.utils';

@Injectable()
export class CreateMyJobUseCase implements CreateMyJobUseCaseInterface {
  constructor(
    @Inject(CREATE_MY_JOB_REPOSITORY)
    private readonly createMyJobRepository: CreateMyJobRepositoryInterface,
  ) {}

  async execute(input: CreateMyJobInputDto): Promise<CreateMyJobOutputDto> {
    const companyId = await this.createMyJobRepository.findRecruiterCompanyId(
      input.userId,
      input.companyId,
    );

    if (!companyId) {
      throw new BadRequestException(
        'Recruiter does not have a company linked to profile.',
      );
    }

    const hasDuplicate = await this.createMyJobRepository.existsDuplicate(
      companyId,
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
      requestedSlug || (await this.buildDefaultSlug(companyId, input.title));
    const slug = await this.generateUniqueSlug(baseSlug);

    return this.createMyJobRepository.create({
      ...input,
      companyId,
      slug,
      status: JobStatusEnum.PENDING,
    });
  }

  private async generateUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (await this.createMyJobRepository.existsBySlug(slug)) {
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
      await this.createMyJobRepository.findCompanySlugContext(companyId);

    return SlugUtils.generate(
      [title, company?.tradeName, company?.city, company?.state]
        .filter(Boolean)
        .join(' '),
    );
  }
}
