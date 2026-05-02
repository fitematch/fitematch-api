import type { GetMeOutputDto } from '@src/modules/auth/application/dto/output/get-me.output.dto';
import type { GetMeResponseDto } from '@src/modules/auth/adapters/http/dto/response/get-me.response.dto';
import DateUtils from '@src/shared/utils/date.utils';
import { MaskUtils } from '@src/shared/utils/mask.utils';

export class GetMeMapper {
  public static toResponse(user: GetMeOutputDto): GetMeResponseDto {
    const dateUtils = new DateUtils();
    const maskUtils = new MaskUtils();

    return {
      id: user.id,
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
      permissions: user.permissions,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
