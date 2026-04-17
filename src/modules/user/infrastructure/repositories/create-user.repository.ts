import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { CreateUserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/create-user.repository.interface';
import type { CreateUserInputDto } from '@src/modules/user/application/dto/input/create-user.input.dto';
import type { CreateUserOutputDto } from '@src/modules/user/application/dto/output/create-user.output.dto';
import {
  UserSchema,
  type UserDocument,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';

@Injectable()
export class CreateUserRepository implements CreateUserRepositoryInterface {
  constructor(
    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(input: CreateUserInputDto): Promise<CreateUserOutputDto> {
    const createdUser = await this.userModel.create({
      name: input.name,
      email: input.email,
      password: input.password,
      birthday: input.birthday ? new Date(input.birthday) : undefined,
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
              linkedin: input.contacts.social.linkedin,
              youtube: input.contacts.social.youtube,
              tiktok: input.contacts.social.tiktok,
            }
          : undefined,
      },
      media: input.media,
      productRole: input.productRole,
      adminRole: input.adminRole,
      status: input.status,
    });

    return {
      id: createdUser._id.toString(),
      name: createdUser.name,
      email: createdUser.email,
      birthday: createdUser.birthday
        ? createdUser.birthday.toISOString().split('T')[0]
        : undefined,
      documents: createdUser.documents as CreateUserOutputDto['documents'],
      contacts: createdUser.contacts
        ? {
            phone: createdUser.contacts.phone
              ? {
                  countryCode: createdUser.contacts.phone.countryCode,
                  areaCode: createdUser.contacts.phone.areaCode,
                  number: createdUser.contacts.phone.number,
                  isWhatsapp: createdUser.contacts.phone.isWhatsapp,
                  isTelegram: createdUser.contacts.phone.isTelegram,
                }
              : undefined,
            address: createdUser.contacts.address
              ? {
                  street: createdUser.contacts.address.street,
                  number: createdUser.contacts.address.number,
                  complement: createdUser.contacts.address.complement,
                  neighborhood: createdUser.contacts.address.neighborhood,
                  city: createdUser.contacts.address.city,
                  state: createdUser.contacts.address.state,
                  country: createdUser.contacts.address.country,
                  zipCode: createdUser.contacts.address.zipCode,
                }
              : undefined,
            social: createdUser.contacts.social
              ? {
                  facebook: createdUser.contacts.social.facebook,
                  instagram: createdUser.contacts.social.instagram,
                  x: createdUser.contacts.social.x,
                  youtube: createdUser.contacts.social.youtube,
                  tiktok: createdUser.contacts.social.tiktok,
                  linkedin: createdUser.contacts.social.linkedin,
                }
              : undefined,
          }
        : undefined,
      media: createdUser.media
        ? {
            resumeUrl: createdUser.media.resumeUrl,
          }
        : undefined,
      status: createdUser.status,
      productRole: createdUser.productRole,
      adminRole: createdUser.adminRole,
    };
  }
}
