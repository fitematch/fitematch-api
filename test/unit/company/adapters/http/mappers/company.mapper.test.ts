import { CreateCompanyMapper } from '@src/modules/company/adapters/http/mappers/create-company.mapper';
import { ListCompanyMapper } from '@src/modules/company/adapters/http/mappers/list-company.mapper';
import { ReadCompanyMapper } from '@src/modules/company/adapters/http/mappers/read-company.mapper';
import { UpdateCompanyMapper } from '@src/modules/company/adapters/http/mappers/update-company.mapper';
import { CompanyStatusEnum } from '@src/modules/company/domain/enums/company-status.enum';

const company = {
  id: 'company-1',
  slug: 'umbrella-corp',
  tradeName: 'Umbrella Corp',
  legalName: 'Umbrella Corporation LTDA',
  contacts: {
    email: 'contact@umbrella.com',
    website: 'https://umbrella.com',
    phone: {
      country: '+55',
      number: '11987654321',
      isWhatsapp: true,
      isTelegram: false,
    },
    address: {
      street: 'Rua A',
      number: '100',
      neighborhood: 'Centro',
      city: 'Sao Paulo',
      state: 'SP',
      country: 'Brasil',
      zipCode: '12345678',
    },
  },
  documents: {
    cnpj: '12345678000190',
    isVerified: true,
  },
  media: {
    logoUrl: 'https://cdn.example.com/logo.png',
  },
  status: CompanyStatusEnum.ACTIVE,
};

describe('Company Mappers', () => {
  it('should apply masks in create mapper', () => {
    const result = CreateCompanyMapper.toResponse(company);

    expect(result.contacts.phone.number).toBe('(11) 98765-4321');
    expect(result.contacts.address.zipCode).toBe('12345-678');
    expect(result.documents.cnpj).toBe('12.345.678/0001-90');
  });

  it('should apply masks in list mapper', () => {
    const result = ListCompanyMapper.toResponse(company);

    expect(result.contacts.phone.number).toBe('(11) 98765-4321');
    expect(result.contacts.address.zipCode).toBe('12345-678');
    expect(result.documents.cnpj).toBe('12.345.678/0001-90');
  });

  it('should apply masks in read mapper', () => {
    const result = ReadCompanyMapper.toResponse(company);

    expect(result.contacts.phone.number).toBe('(11) 98765-4321');
    expect(result.contacts.address.zipCode).toBe('12345-678');
    expect(result.documents.cnpj).toBe('12.345.678/0001-90');
  });

  it('should apply masks in update mapper', () => {
    const result = UpdateCompanyMapper.toResponse(company);

    expect(result.contacts.phone.number).toBe('(11) 98765-4321');
    expect(result.contacts.address.zipCode).toBe('12345-678');
    expect(result.documents.cnpj).toBe('12.345.678/0001-90');
  });
});
