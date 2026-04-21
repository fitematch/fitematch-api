import { ListUserMapper } from '@src/modules/user/adapters/http/mappers/list-user.mapper';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';

describe('ListUserMapper', () => {
  describe('toResponse', () => {
    it('should format birthday and candidate document numbers', () => {
      const result = ListUserMapper.toResponse({
        _id: 'user-id-1',
        name: 'Rebecca Chambers',
        email: 'rebecca@fitematch.com',
        birthday: '1998-07-29',
        candidateProfile: {
          documents: {
            rg: {
              number: '12345678x',
              issuer: 'SSP',
              state: 'SP',
            },
            cpf: {
              number: '12345678901',
            },
            cref: {
              number: '123456gsp',
              category: 'SP',
              isActive: true,
            },
            passport: {
              number: 'ab-12.3456',
              country: 'Brasil',
              expirationDate: new Date('2030-01-01T00:00:00.000Z'),
            },
          },
          contacts: {
            phone: {
              country: 'Brasil',
              number: '11987654321',
              isWhatsapp: true,
              isTelegram: false,
            },
            address: {
              street: 'Rua A',
              number: '123',
              neighborhood: 'Centro',
              city: 'Sao Paulo',
              state: 'SP',
              country: 'Brasil',
              zipCode: '12345678',
            },
          },
        },
        productRole: ProductRoleEnum.CANDIDATE,
        status: UserStatusEnum.ACTIVE,
      });

      expect(result.birthday).toBe('29/07/1998');
      expect(result.candidateProfile?.documents?.rg?.number).toBe(
        '12.345.678-X',
      );
      expect(result.candidateProfile?.documents?.cpf?.number).toBe(
        '123.456.789-01',
      );
      expect(result.candidateProfile?.documents?.cref?.number).toBe(
        '123456-G/SP',
      );
      expect(result.candidateProfile?.documents?.passport?.number).toBe(
        'AB123456',
      );
      expect(result.candidateProfile?.contacts?.phone?.number).toBe(
        '(11) 98765-4321',
      );
      expect(result.candidateProfile?.contacts?.address?.zipCode).toBe(
        '12345-678',
      );
    });
  });
});
