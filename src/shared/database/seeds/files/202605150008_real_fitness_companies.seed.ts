import {
  CompanySchema,
  type CompanyDocument,
} from '@src/modules/company/infrastructure/database/mongoose/schemas/company.schema';
import { CompanyStatusEnum } from '@src/modules/company/domain/enums/company-status.enum';
import type { SeedInterface } from '@src/shared/database/seeds/contracts/seed.interface';

const companies = [
  {
    slug: 'caicara-fit',
    tradeName: 'Caicara Fit',
    legalName: 'Caicara Fit Academia LTDA',
    contacts: {
      email: 'contato@caicarafit.com.br',
      website: 'https://www.caicarafit.com.br/',
      phone: {
        country: '55',
        number: '1335974100',
        isWhatsapp: true,
      },
      address: {
        street: 'Avenida Presidente Kennedy',
        number: '12840',
        neighborhood: 'Caiçara',
        city: 'Praia Grande',
        state: 'SP',
        country: 'Brasil',
        zipCode: '11706200',
      },
    },
    documents: {
      cnpj: '12345678000195',
      isVerified: true,
    },
    media: {
      logoUrl: '/images/logo/caicara-fit.png',
    },
    status: CompanyStatusEnum.ACTIVE,
  },
  {
    slug: 'inspire',
    tradeName: 'Inspire',
    legalName: 'Inspire Treinamento Integrado LTDA',
    contacts: {
      email: 'contato@inspirefitness.com.br',
      website: 'https://www.inspirefitness.com.br/',
      phone: {
        country: '55',
        number: '1332875520',
        isWhatsapp: true,
      },
      address: {
        street: 'Avenida Epitacio Pessoa',
        number: '312',
        neighborhood: 'Embare',
        city: 'Santos',
        state: 'SP',
        country: 'Brasil',
        zipCode: '11045202',
      },
    },
    documents: {
      cnpj: '12345678000276',
      isVerified: true,
    },
    media: {
      logoUrl: '/images/logo/inspire.png',
    },
    status: CompanyStatusEnum.ACTIVE,
  },
  {
    slug: 'iron-force',
    tradeName: 'Iron Force',
    legalName: 'Iron Force Performance LTDA',
    contacts: {
      email: 'atendimento@ironforce.com.br',
      website: 'https://www.ironforce.com.br/',
      phone: {
        country: '55',
        number: '1334918800',
        isWhatsapp: true,
      },
      address: {
        street: 'Avenida Presidente Castelo Branco',
        number: '4520',
        neighborhood: 'Boqueirao',
        city: 'Praia Grande',
        state: 'SP',
        country: 'Brasil',
        zipCode: '11701020',
      },
    },
    documents: {
      cnpj: '12345678000357',
      isVerified: true,
    },
    media: {
      logoUrl: '/images/logo/iron-force.png',
    },
    status: CompanyStatusEnum.ACTIVE,
  },
  {
    slug: 'nexo',
    tradeName: 'Nexo',
    legalName: 'Nexo Wellness Club LTDA',
    contacts: {
      email: 'contato@nexowellness.com.br',
      website: 'https://www.nexowellness.com.br/',
      phone: {
        country: '55',
        number: '1332846677',
        isWhatsapp: true,
      },
      address: {
        street: 'Avenida Ana Costa',
        number: '549',
        neighborhood: 'Gonzaga',
        city: 'Santos',
        state: 'SP',
        country: 'Brasil',
        zipCode: '11060003',
      },
    },
    documents: {
      cnpj: '12345678000438',
      isVerified: true,
    },
    media: {
      logoUrl: '/images/logo/nexo.png',
    },
    status: CompanyStatusEnum.ACTIVE,
  },
  {
    slug: 'ocian',
    tradeName: 'Ocian',
    legalName: 'Ocian Movimento Academia LTDA',
    contacts: {
      email: 'contato@ocianfit.com.br',
      website: 'https://www.ocianfit.com.br/',
      phone: {
        country: '55',
        number: '1335962244',
        isWhatsapp: true,
      },
      address: {
        street: 'Avenida Presidente Kennedy',
        number: '8200',
        neighborhood: 'Ocian',
        city: 'Praia Grande',
        state: 'SP',
        country: 'Brasil',
        zipCode: '11704200',
      },
    },
    documents: {
      cnpj: '12345678000519',
      isVerified: true,
    },
    media: {
      logoUrl: '/images/logo/ocian.png',
    },
    status: CompanyStatusEnum.ACTIVE,
  },
  {
    slug: 'serenity',
    tradeName: 'Serenity',
    legalName: 'Serenity Studio de Bem-Estar LTDA',
    contacts: {
      email: 'contato@serenitystudio.com.br',
      website: 'https://www.serenitystudio.com.br/',
      phone: {
        country: '55',
        number: '1333519090',
        isWhatsapp: true,
      },
      address: {
        street: 'Avenida Puglisi',
        number: '475',
        neighborhood: 'Centro',
        city: 'Guaruja',
        state: 'SP',
        country: 'Brasil',
        zipCode: '11410131',
      },
    },
    documents: {
      cnpj: '12345678000608',
      isVerified: true,
    },
    media: {
      logoUrl: '/images/logo/serenity.png',
    },
    status: CompanyStatusEnum.ACTIVE,
  },
  {
    slug: 'arena',
    tradeName: 'Arena',
    legalName: 'Arena Fitness Club LTDA',
    contacts: {
      email: 'contato@arenafitnessclub.com.br',
      website: 'https://www.arenafitnessclub.com.br/',
      phone: {
        country: '55',
        number: '1130457788',
        isWhatsapp: true,
      },
      address: {
        street: 'Rua Gomes de Carvalho',
        number: '1507',
        neighborhood: 'Vila Olimpia',
        city: 'Sao Paulo',
        state: 'SP',
        country: 'Brasil',
        zipCode: '04547005',
      },
    },
    documents: {
      cnpj: '52345678000195',
      isVerified: true,
    },
    media: {
      logoUrl: '/images/logo/arena.png',
    },
    status: CompanyStatusEnum.ACTIVE,
  },
] as const;

const seed: SeedInterface = {
  name: '202605150008_real_fitness_companies.seed.ts',

  async run({ connection, logger, session }) {
    const companyModel = connection.model<CompanyDocument>(CompanySchema.name);

    await Promise.all(
      companies.map((company) =>
        companyModel.updateOne(
          { 'documents.cnpj': company.documents.cnpj },
          {
            $set: {
              tradeName: company.tradeName,
              legalName: company.legalName,
              contacts: company.contacts,
              documents: company.documents,
              media: company.media,
              status: company.status,
              approval: {
                approvedAt: new Date(),
              },
            },
            $setOnInsert: {
              slug: company.slug,
            },
          },
          {
            upsert: true,
            session,
          },
        ),
      ),
    );

    logger.log(
      `Real fitness companies seed ensured ${companies.length} active companies.`,
    );
  },

  async rollback({ connection, logger, session }) {
    const companyModel = connection.model<CompanyDocument>(CompanySchema.name);

    await companyModel
      .deleteMany(
        {
          'documents.cnpj': {
            $in: companies.map((company) => company.documents.cnpj),
          },
        },
        { session },
      )
      .exec();

    logger.log(
      'Real fitness companies seed rollback removed seeded companies.',
    );
  },
};

export default seed;
