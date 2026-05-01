import { UpdateMeRequestMapper } from '@src/modules/auth/adapters/http/mappers/update-me-request.mapper';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { AvailabilityShiftEnum } from '@src/shared/domain/enums/availability-shift.enum';
import { ClothingSizeEnum } from '@src/shared/domain/enums/clothing-size.enum';
import { CourseTypeEnum } from '@src/shared/domain/enums/course-type.enum';
import { GenderIdentityEnum } from '@src/shared/domain/enums/gender-identity.enum';
import { SexualOrientationEnum } from '@src/shared/domain/enums/sexual-orientation.enum';
import { ShoesSizeUnitEnum } from '@src/shared/domain/enums/shoes-size-unit.enum';

describe('UpdateMeRequestMapper', () => {
  describe('toInput', () => {
    it('should map authenticated user and body to update me input with profiles', () => {
      const user = {
        id: 'user-1',
        email: 'candidate@fitematch.com',
        productRole: ProductRoleEnum.CANDIDATE,
      };
      const body = {
        name: 'Rebecca Chambers',
        birthday: '1998-07-29',
        candidateProfile: {
          documents: {
            rg: {
              number: '123456789',
              issuer: 'SSP',
              state: 'SP',
            },
            cpf: {
              number: '12345678909',
            },
            passport: {
              number: 'BR123456',
              country: 'BR',
              expirationDate: '2030-12-31',
            },
          },
          contacts: {
            phone: {
              country: '+55',
              number: '11999999999',
              isWhatsapp: true,
              isTelegram: false,
            },
            address: {
              street: 'Rua das Palmeiras',
              number: '100',
              city: 'Sao Paulo',
              state: 'SP',
              country: 'BR',
              zipCode: '01001000',
            },
            social: {
              linkedin: 'https://linkedin.com/in/rebecca-chambers',
            },
          },
          diversity: {
            genderIdentity: GenderIdentityEnum.FEMALE,
            sexualOrientation: SexualOrientationEnum.PREFER_NOT_TO_SAY,
          },
          physicalAttributes: {
            height: 168,
            weight: 58,
          },
          uniform: {
            tShirtSize: ClothingSizeEnum.M,
            shoeSize: 37,
            shoeSizeUnit: ShoesSizeUnitEnum.BR,
          },
          educations: [
            {
              courseName: 'Educacao Fisica',
              institution: 'USP',
              startYear: 2017,
              endYear: 2021,
              courseType: CourseTypeEnum.BACHELOR,
              isOngoing: false,
            },
          ],
          professionalExperiences: [
            {
              companyName: 'Fit Center',
              role: 'Personal Trainer',
              startYear: 2022,
              isCurrent: true,
            },
          ],
          availability: [AvailabilityShiftEnum.MORNING],
        },
        recruiterProfile: {
          companyId: 'company-1',
          position: 'Recruiter',
          contacts: {
            phone: {
              country: '+55',
              number: '11888888888',
            },
          },
        },
      };

      const result = UpdateMeRequestMapper.toInput(user, body);

      expect(result).toEqual({
        userId: user.id,
        name: body.name,
        birthday: body.birthday,
        candidateProfile: {
          documents: {
            rg: body.candidateProfile.documents.rg,
            cpf: body.candidateProfile.documents.cpf,
            cref: undefined,
            passport: {
              number: body.candidateProfile.documents.passport.number,
              country: body.candidateProfile.documents.passport.country,
              expirationDate: new Date('2030-12-31'),
            },
          },
          contacts: {
            phone: body.candidateProfile.contacts.phone,
            address: {
              ...body.candidateProfile.contacts.address,
              complement: undefined,
              neighborhood: undefined,
            },
            social: {
              facebook: undefined,
              instagram: undefined,
              x: undefined,
              youtube: undefined,
              tiktok: undefined,
              linkedin: body.candidateProfile.contacts.social.linkedin,
            },
          },
          media: undefined,
          ethnicity: undefined,
          diversity: body.candidateProfile.diversity,
          physicalAttributes: body.candidateProfile.physicalAttributes,
          uniform: {
            tShirtSize: body.candidateProfile.uniform.tShirtSize,
            jacketSize: undefined,
            shortSize: undefined,
            pantsSize: undefined,
            shoeSize: body.candidateProfile.uniform.shoeSize,
            shoeSizeUnit: body.candidateProfile.uniform.shoeSizeUnit,
          },
          educations: body.candidateProfile.educations,
          professionalExperiences:
            body.candidateProfile.professionalExperiences,
          availability: body.candidateProfile.availability,
        },
        recruiterProfile: {
          companyId: body.recruiterProfile.companyId,
          position: body.recruiterProfile.position,
          contacts: {
            phone: {
              country: body.recruiterProfile.contacts.phone.country,
              number: body.recruiterProfile.contacts.phone.number,
              isWhatsapp: undefined,
              isTelegram: undefined,
            },
          },
        },
      });
    });
  });
});
