import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { ReadUserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/read-user.repository.interface';
import type { ReadUserInputDto } from '@src/modules/user/application/dto/input/read-user.input.dto';
import type { ReadUserOutputDto } from '@src/modules/user/application/dto/output/read-user.output.dto';
import {
  UserSchema,
  type UserDocument,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';

@Injectable()
export class ReadUserRepository implements ReadUserRepositoryInterface {
  constructor(
    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async read(input: ReadUserInputDto): Promise<ReadUserOutputDto | null> {
    const user = await this.userModel.findById(input.id).lean().exec();

    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      birthday: user.birthday
        ? new Date(user.birthday).toISOString().split('T')[0]
        : undefined,
      documents: user.documents
        ? {
            identityDocumentNumber: user.documents.identityDocumentNumber,
            identityIssuer: user.documents.identityIssuer,
            identityState: user.documents.identityState,
            socialDocumentNumber: user.documents.socialDocumentNumber,
          }
        : undefined,
      phone: user.phone
        ? {
            number: user.phone.number,
            isWhatsapp: user.phone.isWhatsapp,
            isTelegram: user.phone.isTelegram,
          }
        : undefined,
      address: user.address
        ? {
            street: user.address.street,
            number: user.address.number,
            complement: user.address.complement,
            neighborhood: user.address.neighborhood,
            city: user.address.city,
            state: user.address.state,
            country: user.address.country,
            zipCode: user.address.zipCode,
          }
        : undefined,
      social: user.social
        ? {
            facebook: user.social.facebook,
            instagram: user.social.instagram,
            x: user.social.x,
            youtube: user.social.youtube,
            tiktok: user.social.tiktok,
            linkedin: user.social.linkedin,
          }
        : undefined,
      media: user.media
        ? {
            resumeUrl: user.media.resumeUrl,
          }
        : undefined,
      productRole: user.productRole,
      adminRole: user.adminRole,
      status: user.status,
    };
  }
}
