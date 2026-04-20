import type { UpdateUserInputDto } from '@src/modules/user/application/dto/input/update-user.input.dto';
import type { UpdateUserParamsDto } from '@src/modules/user/adapters/http/dto/request/update-user.params.dto';
import type { UpdateUserRequestDto } from '@src/modules/user/adapters/http/dto/request/update-user.request.dto';

export class UpdateUserRequestMapper {
  static toInput(
    params: UpdateUserParamsDto,
    body: UpdateUserRequestDto,
  ): UpdateUserInputDto {
    return {
      id: params.id,
      name: body.name,
      email: body.email,
      password: body.password,
      birthday: body.birthday,
      candidateProfile: body.candidateProfile
        ? {
            documents: body.candidateProfile.documents
              ? {
                  rg: body.candidateProfile.documents.rg
                    ? {
                        number: body.candidateProfile.documents.rg.number!,
                        issuer: body.candidateProfile.documents.rg.issuer!,
                        state: body.candidateProfile.documents.rg.state!,
                      }
                    : undefined,
                  cpf: body.candidateProfile.documents.cpf
                    ? {
                        number: body.candidateProfile.documents.cpf.number!,
                      }
                    : undefined,
                  cref: body.candidateProfile.documents.cref
                    ? {
                        number: body.candidateProfile.documents.cref.number!,
                        category:
                          body.candidateProfile.documents.cref.category!,
                        isActive:
                          body.candidateProfile.documents.cref.isActive!,
                      }
                    : undefined,
                  passport: body.candidateProfile.documents.passport
                    ? {
                        number:
                          body.candidateProfile.documents.passport.number!,
                        country:
                          body.candidateProfile.documents.passport.country!,
                        expirationDate: new Date(
                          body.candidateProfile.documents.passport
                            .expirationDate!,
                        ),
                      }
                    : undefined,
                }
              : undefined,
            contacts: body.candidateProfile.contacts
              ? {
                  phone: body.candidateProfile.contacts.phone
                    ? {
                        country: body.candidateProfile.contacts.phone.country,
                        number: body.candidateProfile.contacts.phone.number,
                        isWhatsapp:
                          body.candidateProfile.contacts.phone.isWhatsapp,
                        isTelegram:
                          body.candidateProfile.contacts.phone.isTelegram,
                      }
                    : undefined,
                  address: body.candidateProfile.contacts.address
                    ? {
                        street: body.candidateProfile.contacts.address.street,
                        number: body.candidateProfile.contacts.address.number,
                        complement:
                          body.candidateProfile.contacts.address.complement,
                        neighborhood:
                          body.candidateProfile.contacts.address.neighborhood,
                        city: body.candidateProfile.contacts.address.city,
                        state: body.candidateProfile.contacts.address.state,
                        country: body.candidateProfile.contacts.address.country,
                        zipCode: body.candidateProfile.contacts.address.zipCode,
                      }
                    : undefined,
                  social: body.candidateProfile.contacts.social
                    ? {
                        facebook:
                          body.candidateProfile.contacts.social.facebook,
                        instagram:
                          body.candidateProfile.contacts.social.instagram,
                        x: body.candidateProfile.contacts.social.x,
                        youtube: body.candidateProfile.contacts.social.youtube,
                        tiktok: body.candidateProfile.contacts.social.tiktok,
                        linkedin:
                          body.candidateProfile.contacts.social.linkedin,
                      }
                    : undefined,
                }
              : undefined,
            media: body.candidateProfile.media
              ? {
                  resumeUrl: body.candidateProfile.media.resumeUrl,
                }
              : undefined,
            ethnicity: body.candidateProfile.ethnicity,
            diversity: body.candidateProfile.diversity
              ? {
                  genderIdentity:
                    body.candidateProfile.diversity.genderIdentity,
                  sexualOrientation:
                    body.candidateProfile.diversity.sexualOrientation,
                }
              : undefined,
            physicalAttributes: body.candidateProfile.physicalAttributes
              ? {
                  height: body.candidateProfile.physicalAttributes.height,
                  weight: body.candidateProfile.physicalAttributes.weight,
                }
              : undefined,
            uniform: body.candidateProfile.uniform
              ? {
                  tShirtSize: body.candidateProfile.uniform.tShirtSize,
                  jacketSize: body.candidateProfile.uniform.jacketSize,
                  shortSize: body.candidateProfile.uniform.shortSize,
                  pantsSize: body.candidateProfile.uniform.pantsSize,
                  shoeSize: body.candidateProfile.uniform.shoeSize,
                  shoeSizeUnit: body.candidateProfile.uniform.shoeSizeUnit,
                }
              : undefined,
            educations: body.candidateProfile.educations?.map((education) => ({
              courseName: education.courseName,
              institution: education.institution,
              startYear: education.startYear,
              endYear: education.endYear,
              courseType: education.courseType,
              isOngoing: education.isOngoing,
            })),
            professionalExperiences:
              body.candidateProfile.professionalExperiences?.map(
                (experience) => ({
                  companyName: experience.companyName,
                  role: experience.role,
                  startYear: experience.startYear,
                  endYear: experience.endYear,
                  isCurrent: experience.isCurrent,
                }),
              ),
            availability: body.candidateProfile.availability,
          }
        : undefined,
      recruiterProfile: body.recruiterProfile
        ? {
            companyId: body.recruiterProfile.companyId,
            position: body.recruiterProfile.position,
            contacts: body.recruiterProfile.contacts
              ? {
                  phone: body.recruiterProfile.contacts.phone
                    ? {
                        country: body.recruiterProfile.contacts.phone.country,
                        number: body.recruiterProfile.contacts.phone.number,
                        isWhatsapp:
                          body.recruiterProfile.contacts.phone.isWhatsapp,
                        isTelegram:
                          body.recruiterProfile.contacts.phone.isTelegram,
                      }
                    : undefined,
                }
              : undefined,
          }
        : undefined,
      productRole: body.productRole,
      adminRole: body.adminRole,
      status: body.status,
    };
  }
}
