import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { CreateMyJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/create-my-job.repository.interface';
import type { CreateMyJobInputDto } from '@src/modules/job/application/dto/input/create-my-job.input.dto';
import type { CreateMyJobOutputDto } from '@src/modules/job/application/dto/output/create-my-job.output.dto';
import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';
import {
  JobSchema,
  type JobDocument,
} from '@src/modules/job/infrastructure/database/mongoose/schemas/job.schema';
import { CompanySchema } from '@src/modules/company/infrastructure/database/mongoose/schemas/company.schema';
import { UserSchema } from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import { SlugUtils } from '@src/shared/utils/slug.utils';

type CreatedJobPlain = Omit<CreateMyJobOutputDto, '_id'> & {
  _id: { toString(): string };
};

@Injectable()
export class CreateMyJobRepository implements CreateMyJobRepositoryInterface {
  constructor(
    @InjectModel(JobSchema.name)
    private readonly jobModel: Model<JobDocument>,

    @InjectModel(CompanySchema.name)
    private readonly companyModel: Model<CompanySchema>,

    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserSchema>,
  ) {}

  async findRecruiterCompanyId(
    userId: string,
    requestedCompanyId?: string,
  ): Promise<string | null> {
    const user = await this.userModel.findById(userId).lean().exec();

    if (requestedCompanyId) {
      const ownsCompany =
        user?.recruiterProfile?.companyId === requestedCompanyId ||
        !!(await this.companyModel
          .findOne({
            _id: requestedCompanyId,
            'audit.createdByUserId': userId,
          })
          .lean()
          .exec());

      if (!ownsCompany) {
        return null;
      }

      if (user?.recruiterProfile?.companyId !== requestedCompanyId) {
        await this.userModel
          .findByIdAndUpdate(userId, {
            $set: { 'recruiterProfile.companyId': requestedCompanyId },
          })
          .exec();
      }

      return requestedCompanyId;
    }

    if (user?.recruiterProfile?.companyId) {
      return user.recruiterProfile.companyId;
    }

    const company = await this.companyModel
      .findOne({ 'audit.createdByUserId': userId }, { _id: 1 })
      .lean()
      .exec();

    if (!company) {
      return null;
    }

    const resolvedCompanyId = company._id.toString();

    await this.userModel
      .findByIdAndUpdate(userId, {
        $set: { 'recruiterProfile.companyId': resolvedCompanyId },
      })
      .exec();

    return resolvedCompanyId;
  }

  async findCompanySlugContext(companyId: string): Promise<{
    tradeName?: string;
    city?: string;
    state?: string;
  } | null> {
    const company = await this.companyModel
      .findById(companyId, {
        tradeName: 1,
        'contacts.address.city': 1,
        'contacts.address.state': 1,
      })
      .lean()
      .exec();

    if (!company) {
      return null;
    }

    return {
      tradeName: company.tradeName,
      city: company.contacts?.address?.city,
      state: company.contacts?.address?.state,
    };
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const job = await this.jobModel.findOne({ slug }).lean().exec();

    return !!job;
  }

  async existsDuplicate(
    companyId: string,
    title: string,
    statuses: JobStatusEnum[],
  ): Promise<boolean> {
    const normalizedTitle = SlugUtils.generate(title);

    const job = await this.jobModel
      .findOne({
        companyId,
        normalizedTitle,
        status: { $in: statuses },
      })
      .lean()
      .exec();

    return !!job;
  }

  async create(
    input: CreateMyJobInputDto & { companyId: string },
  ): Promise<CreateMyJobOutputDto> {
    try {
      const createdJob = await this.jobModel.create({
        slug: input.slug,
        companyId: input.companyId,
        title: input.title,
        normalizedTitle: SlugUtils.generate(input.title),
        description: input.description,
        slots: input.slots,
        requirements: input.requirements,
        benefits: input.benefits,
        media: input.media,
        contractType: input.contractType,
        status: input.status,
      });

      const job = createdJob.toObject() as CreatedJobPlain;

      return {
        _id: job._id.toString(),
        slug: job.slug,
        companyId: job.companyId,
        title: job.title,
        description: job.description,
        slots: job.slots,
        requirements: job.requirements,
        benefits: job.benefits,
        media: job.media,
        contractType: job.contractType,
        status: job.status,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
      };
    } catch (error: unknown) {
      if (this.isDuplicateActiveTitleError(error)) {
        throw new ConflictException(
          'A job with the same title already exists for this company.',
        );
      }

      throw error;
    }
  }

  private isDuplicateActiveTitleError(error: unknown): boolean {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000 &&
      'keyPattern' in error &&
      typeof error.keyPattern === 'object' &&
      error.keyPattern !== null
    ) {
      const keyPattern = error.keyPattern as Record<string, unknown>;

      return (
        'companyId' in keyPattern &&
        'normalizedTitle' in keyPattern &&
        'status' in keyPattern
      );
    }

    return false;
  }
}
