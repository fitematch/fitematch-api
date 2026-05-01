import { GetMeMapper } from '@src/modules/auth/adapters/http/mappers/get-me.mapper';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';
import { AvailabilityShiftEnum } from '@src/shared/domain/enums/availability-shift.enum';
import { PermissionEnum } from '@src/shared/domain/enums/permission.enum';

describe('GetMeMapper', () => {
  describe('toResponse', () => {
    it('should map the authenticated user profile to the response dto', () => {
      const user = {
        id: 'user-1',
        name: 'Rebecca Chambers',
        email: 'rebecca@fitematch.com',
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
            cref: {
              number: '123456GSP',
              category: 'g',
              isActive: true,
            },
            passport: {
              number: 'br123456',
              country: 'BR',
              expirationDate: new Date('2030-12-31T00:00:00.000Z'),
            },
          },
          contacts: {
            phone: {
              country: '+55',
              number: '11999999999',
              isWhatsapp: true,
            },
            address: {
              street: 'Rua das Palmeiras',
              number: '100',
              city: 'Sao Paulo',
              state: 'SP',
              country: 'BR',
              zipCode: '01001000',
            },
          },
          availability: [AvailabilityShiftEnum.MORNING],
        },
        recruiterProfile: {
          companyId: 'company-1',
          position: 'Recruiter',
          contacts: {
            phone: {
              country: '+55',
              number: '1188888888',
            },
          },
        },
        productRole: ProductRoleEnum.RECRUITER,
        adminRole: AdminRoleEnum.SUPER_ADMIN,
        permissions: [PermissionEnum.CREATE_USERS],
        status: UserStatusEnum.ACTIVE,
        createdAt: new Date('2026-04-21T12:00:00.000Z'),
        updatedAt: new Date('2026-04-22T12:00:00.000Z'),
      };

      const result = GetMeMapper.toResponse(user);

      expect(result).toEqual({
        ...user,
        birthday: '29/07/1998',
        candidateProfile: {
          ...user.candidateProfile,
          documents: {
            ...user.candidateProfile.documents,
            rg: {
              ...user.candidateProfile.documents.rg,
              number: '12.345.678-9',
            },
            cpf: {
              ...user.candidateProfile.documents.cpf,
              number: '123.456.789-09',
            },
            cref: {
              ...user.candidateProfile.documents.cref,
              number: '123456-G/SP',
            },
            passport: {
              ...user.candidateProfile.documents.passport,
              number: 'BR123456',
            },
          },
          contacts: {
            ...user.candidateProfile.contacts,
            phone: {
              ...user.candidateProfile.contacts.phone,
              number: '(11) 99999-9999',
            },
            address: {
              ...user.candidateProfile.contacts.address,
              zipCode: '01001-000',
            },
          },
        },
        recruiterProfile: {
          ...user.recruiterProfile,
          contacts: {
            ...user.recruiterProfile.contacts,
            phone: {
              ...user.recruiterProfile.contacts.phone,
              number: '(11) 88888-888',
            },
          },
        },
      });
    });
  });
});
