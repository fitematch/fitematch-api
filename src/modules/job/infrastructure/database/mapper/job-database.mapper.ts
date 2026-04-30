import type {
  BenefitsEntity,
  JobEntity,
  RequirementsEntity,
} from '@src/modules/job/domain/entities/job.entity';
import type { JobDocument } from '@src/modules/job/infrastructure/database/mongoose/schemas/job.schema';

export class JobDatabaseMapper {
  static toEntity(document: JobDocument): JobEntity {
    return {
      _id: document._id.toString(),
      slug: document.slug,
      companyId: document.companyId,
      title: document.title,
      description: document.description,
      slots: document.slots,
      requirements: document.requirements as RequirementsEntity | undefined,
      benefits: document.benefits as BenefitsEntity | undefined,
      media: document.media,
      contractType: document.contractType,
      status: document.status,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
