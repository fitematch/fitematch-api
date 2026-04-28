import ApplyEntity from '@src/modules/apply/domain/entities/apply.entity';
import { ApplyDocument } from '@src/modules/apply/infrastructure/database/mongoose/schemas/apply.schema';

export class ApplyDatabaseMapper {
  static toEntity(document: ApplyDocument): ApplyEntity {
    return {
      _id: document._id.toString(),
      jobId: document.jobId,
      userId: document.userId,
      status: document.status,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
