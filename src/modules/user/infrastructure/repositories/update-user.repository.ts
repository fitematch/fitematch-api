import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { UpdateUserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/update-user.repository.interface';
import type { UpdateUserInputDto } from '@src/modules/user/application/dto/input/update-user.input.dto';
import type { UpdateUserOutputDto } from '@src/modules/user/application/dto/output/update-user.output.dto';
import {
  UserSchema,
  type UserDocument,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';

@Injectable()
export class UpdateUserRepository implements UpdateUserRepositoryInterface {
  constructor(
    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async update(input: UpdateUserInputDto): Promise<UpdateUserOutputDto | null> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        input.id,
        {
          ...(input.name !== undefined && { name: input.name }),
          ...(input.email !== undefined && { email: input.email }),
          ...(input.password !== undefined && { password: input.password }),
          ...(input.birthday !== undefined && {
            birthday: input.birthday ? new Date(input.birthday) : undefined,
          }),
          ...(input.documents !== undefined && {
            documents: {
              rg: input.documents?.rg
                ? {
                    number: input.documents.rg.number,
                    issuer: input.documents.rg.issuer,
                    state: input.documents.rg.state,
                  }
                : undefined,
              cpf: input.documents?.cpf
                ? {
                    number: input.documents.cpf.number,
                  }
                : undefined,
              cref: input.documents?.cref
                ? {
                    number: input.documents.cref.number,
                    category: input.documents.cref.category,
                    isActive: input.documents.cref.isActive,
                  }
                : undefined,
              passport: input.documents?.passport
                ? {
                    number: input.documents.passport.number,
                    country: input.documents.passport.country,
                    expirationDate: input.documents.passport.expirationDate
                      ? new Date(input.documents.passport.expirationDate)
                      : undefined,
                  }
                : undefined,
            },
          }),
          ...(input.contacts !== undefined && {
            contacts: {
              phone: input.contacts?.phone
                ? {
                    countryCode: input.contacts.phone.countryCode,
                    areaCode: input.contacts.phone.areaCode,
                    number: input.contacts.phone.number,
                    isWhatsapp: input.contacts.phone.isWhatsapp,
                    isTelegram: input.contacts.phone.isTelegram,
                  }
                : undefined,
              address: input.contacts?.address
                ? {
                    street: input.contacts.address.street,
                    number: input.contacts.address.number,
                    complement: input.contacts.address.complement,
                    neighborhood: input.contacts.address.neighborhood,
                    city: input.contacts.address.city,
                    state: input.contacts.address.state,
                    country: input.contacts.address.country,
                    zipCode: input.contacts.address.zipCode,
                  }
                : undefined,
              social: input.contacts?.social
                ? {
                    facebook: input.contacts.social.facebook,
                    instagram: input.contacts.social.instagram,
                    x: input.contacts.social.x,
                    youtube: input.contacts.social.youtube,
                    tiktok: input.contacts.social.tiktok,
                    linkedin: input.contacts.social.linkedin,
                  }
                : undefined,
            },
          }),
          ...(input.media !== undefined && { media: input.media }),
          ...(input.productRole !== undefined && {
            productRole: input.productRole,
          }),
          ...(input.adminRole !== undefined && { adminRole: input.adminRole }),
          ...(input.status !== undefined && { status: input.status }),
        },
        {
          new: true,
        },
      )
      .lean()
      .exec();

    if (!updatedUser) {
      return null;
    }

    return {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      birthday: updatedUser.birthday
        ? new Date(updatedUser.birthday).toISOString().split('T')[0]
        : undefined,
      documents: updatedUser.documents as UpdateUserOutputDto['documents'],
      contacts: updatedUser.contacts
        ? {
            phone: updatedUser.contacts.phone
              ? {
                  countryCode: updatedUser.contacts.phone.countryCode,
                  areaCode: updatedUser.contacts.phone.areaCode,
                  number: updatedUser.contacts.phone.number,
                  isWhatsapp: updatedUser.contacts.phone.isWhatsapp,
                  isTelegram: updatedUser.contacts.phone.isTelegram,
                }
              : undefined,
            address: updatedUser.contacts.address
              ? {
                  street: updatedUser.contacts.address.street,
                  number: updatedUser.contacts.address.number,
                  complement: updatedUser.contacts.address.complement,
                  neighborhood: updatedUser.contacts.address.neighborhood,
                  city: updatedUser.contacts.address.city,
                  state: updatedUser.contacts.address.state,
                  zipCode: updatedUser.contacts.address.zipCode,
                  country: updatedUser.contacts.address.country,
                }
              : undefined,
            social: updatedUser.contacts.social
              ? {
                  facebook: updatedUser.contacts.social.facebook,
                  instagram: updatedUser.contacts.social.instagram,
                  x: updatedUser.contacts.social.x,
                  youtube: updatedUser.contacts.social.youtube,
                  tiktok: updatedUser.contacts.social.tiktok,
                  linkedin: updatedUser.contacts.social.linkedin,
                }
              : undefined,
          }
        : undefined,
      media: updatedUser.media
        ? {
            resumeUrl: updatedUser.media.resumeUrl,
          }
        : undefined,
      productRole: updatedUser.productRole,
      adminRole: updatedUser.adminRole,
      status: updatedUser.status,
    };
  }
}
