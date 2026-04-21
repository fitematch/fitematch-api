import type { UpdateUserOutputDto } from '@src/modules/user/application/dto/output/update-user.output.dto';
import type { UpdateUserResponseDto } from '@src/modules/user/adapters/http/dto/response/update-user.response.dto';
import DateUtils from '@src/shared/utils/date.utils';
import { MaskUtils } from '@src/shared/utils/mask.utils';

export class UpdateUserMapper {
  static toResponse(user: UpdateUserOutputDto): UpdateUserResponseDto {
    const dateUtils = new DateUtils();
    const maskUtils = new MaskUtils();

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      birthday: user.birthday ? dateUtils.formatDate(user.birthday) : undefined,
      candidateProfile: user.candidateProfile
        ? {
            ...user.candidateProfile,
            documents: user.candidateProfile.documents
              ? {
                  ...user.candidateProfile.documents,
                  rg: user.candidateProfile.documents.rg
                    ? {
                        ...user.candidateProfile.documents.rg,
                        number: maskUtils.formatRG(
                          user.candidateProfile.documents.rg.number,
                        ),
                      }
                    : undefined,
                  cpf: user.candidateProfile.documents.cpf
                    ? {
                        ...user.candidateProfile.documents.cpf,
                        number: maskUtils.formatCPF(
                          user.candidateProfile.documents.cpf.number,
                        ),
                      }
                    : undefined,
                  cref: user.candidateProfile.documents.cref
                    ? {
                        ...user.candidateProfile.documents.cref,
                        number: maskUtils.formatCREF(
                          user.candidateProfile.documents.cref.number,
                        ),
                      }
                    : undefined,
                  passport: user.candidateProfile.documents.passport
                    ? {
                        ...user.candidateProfile.documents.passport,
                        number: maskUtils.formatPassport(
                          user.candidateProfile.documents.passport.number,
                        ),
                      }
                    : undefined,
                }
              : undefined,
            contacts: user.candidateProfile.contacts
              ? {
                  ...user.candidateProfile.contacts,
                  phone: user.candidateProfile.contacts.phone
                    ? {
                        ...user.candidateProfile.contacts.phone,
                        number: maskUtils.formatPhone(
                          user.candidateProfile.contacts.phone.number,
                        ),
                      }
                    : undefined,
                  address: user.candidateProfile.contacts.address
                    ? {
                        ...user.candidateProfile.contacts.address,
                        zipCode: maskUtils.formatCEP(
                          user.candidateProfile.contacts.address.zipCode,
                        ),
                      }
                    : undefined,
                }
              : undefined,
          }
        : undefined,
      recruiterProfile: user.recruiterProfile
        ? {
            ...user.recruiterProfile,
            contacts: user.recruiterProfile.contacts
              ? {
                  ...user.recruiterProfile.contacts,
                  phone: user.recruiterProfile.contacts.phone
                    ? {
                        ...user.recruiterProfile.contacts.phone,
                        number: maskUtils.formatPhone(
                          user.recruiterProfile.contacts.phone.number,
                        ),
                      }
                    : undefined,
                }
              : undefined,
          }
        : undefined,
      productRole: user.productRole,
      adminRole: user.adminRole,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
