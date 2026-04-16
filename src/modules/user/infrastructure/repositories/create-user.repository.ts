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
      documents: input.documents,
      phone: input.phone,
      address: input.address,
      social: input.social,
      media: input.media,
      status: input.status,
    });

    return {
      id: createdUser._id.toString(),
      name: createdUser.name,
      email: createdUser.email,
      birthday: createdUser.birthday
        ? createdUser.birthday.toISOString().split('T')[0]
        : undefined,
      documents: createdUser.documents
        ? {
            identityDocumentNumber:
              createdUser.documents.identityDocumentNumber,
            identityIssuer: createdUser.documents.identityIssuer,
            identityState: createdUser.documents.identityState,
            socialDocumentNumber: createdUser.documents.socialDocumentNumber,
          }
        : undefined,
      phone: createdUser.phone
        ? {
            number: createdUser.phone.number,
            isWhatsapp: createdUser.phone.isWhatsapp,
            isTelegram: createdUser.phone.isTelegram,
          }
        : undefined,
      address: createdUser.address
        ? {
            street: createdUser.address.street,
            number: createdUser.address.number,
            complement: createdUser.address.complement,
            neighborhood: createdUser.address.neighborhood,
            city: createdUser.address.city,
            state: createdUser.address.state,
            country: createdUser.address.country,
            zipCode: createdUser.address.zipCode,
          }
        : undefined,
      social: createdUser.social
        ? {
            facebook: createdUser.social.facebook,
            instagram: createdUser.social.instagram,
            x: createdUser.social.x,
            youtube: createdUser.social.youtube,
            tiktok: createdUser.social.tiktok,
            linkedin: createdUser.social.linkedin,
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
