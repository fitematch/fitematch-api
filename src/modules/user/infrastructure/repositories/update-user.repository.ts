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
          ...(input.documents !== undefined && { documents: input.documents }),
          ...(input.phone !== undefined && { phone: input.phone }),
          ...(input.address !== undefined && { address: input.address }),
          ...(input.social !== undefined && { social: input.social }),
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
      documents: updatedUser.documents
        ? {
            identityDocumentNumber:
              updatedUser.documents.identityDocumentNumber,
            identityIssuer: updatedUser.documents.identityIssuer,
            identityState: updatedUser.documents.identityState,
            socialDocumentNumber: updatedUser.documents.socialDocumentNumber,
          }
        : undefined,
      phone: updatedUser.phone
        ? {
            number: updatedUser.phone.number,
            isWhatsapp: updatedUser.phone.isWhatsapp,
            isTelegram: updatedUser.phone.isTelegram,
          }
        : undefined,
      address: updatedUser.address
        ? {
            street: updatedUser.address.street,
            number: updatedUser.address.number,
            complement: updatedUser.address.complement,
            neighborhood: updatedUser.address.neighborhood,
            city: updatedUser.address.city,
            state: updatedUser.address.state,
            country: updatedUser.address.country,
            zipCode: updatedUser.address.zipCode,
          }
        : undefined,
      social: updatedUser.social
        ? {
            facebook: updatedUser.social.facebook,
            instagram: updatedUser.social.instagram,
            x: updatedUser.social.x,
            youtube: updatedUser.social.youtube,
            tiktok: updatedUser.social.tiktok,
            linkedin: updatedUser.social.linkedin,
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
