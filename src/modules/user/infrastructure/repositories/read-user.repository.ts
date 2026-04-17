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
      documents: user.documents as ReadUserOutputDto['documents'],
      contacts: user.contacts
        ? {
            phone: user.contacts.phone
              ? {
                  countryCode: user.contacts.phone.countryCode,
                  areaCode: user.contacts.phone.areaCode,
                  number: user.contacts.phone.number,
                  isWhatsapp: user.contacts.phone.isWhatsapp,
                  isTelegram: user.contacts.phone.isTelegram,
                }
              : undefined,
            address: user.contacts.address
              ? {
                  street: user.contacts.address.street,
                  number: user.contacts.address.number,
                  complement: user.contacts.address.complement,
                  neighborhood: user.contacts.address.neighborhood,
                  city: user.contacts.address.city,
                  state: user.contacts.address.state,
                  country: user.contacts.address.country,
                  zipCode: user.contacts.address.zipCode,
                }
              : undefined,
            social: user.contacts.social
              ? {
                  facebook: user.contacts.social.facebook,
                  instagram: user.contacts.social.instagram,
                  x: user.contacts.social.x,
                  youtube: user.contacts.social.youtube,
                  tiktok: user.contacts.social.tiktok,
                  linkedin: user.contacts.social.linkedin,
                }
              : undefined,
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
