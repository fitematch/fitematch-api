import {
  CompanySchema,
  type CompanyDocument,
} from '@src/modules/company/infrastructure/database/mongoose/schemas/company.schema';
import { CompanyStatusEnum } from '@src/modules/company/domain/enums/company-status.enum';
import {
  UserSchema,
  type UserDocument,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import type { SeedInterface } from '@src/shared/database/seeds/contracts/seed.interface';

const COMPANY_SLUG = 'fitematch';
const COMPANY_CNPJ = '12667868000129';
const RECRUITER_EMAIL = 'recruiter@fitematch.com.br';

const seed: SeedInterface = {
  name: '202605150007_fitematch_company.seed.ts',

  async run({ connection, logger, session }) {
    const companyModel = connection.model<CompanyDocument>(CompanySchema.name);
    const userModel = connection.model<UserDocument>(UserSchema.name);

    await companyModel.updateOne(
      { slug: COMPANY_SLUG },
      {
        $set: {
          tradeName: 'fitematch',
          legalName: 'fitematch',
          contacts: {
            email: 'contato@fitematch.com.br',
            website: 'https://fitematch.com.br/',
            phone: {
              country: '55',
              number: '11986418431',
              isWhatsapp: true,
              isTelegram: true,
            },
            address: {
              street: 'Rua Florida',
              number: '504',
              neighborhood: 'Jardim Florida',
              city: 'Praia Grande',
              state: 'SP',
              country: 'Brasil',
              zipCode: '11702440',
            },
          },
          documents: {
            cnpj: COMPANY_CNPJ,
            isVerified: true,
          },
          media: {
            logoUrl: '/public/images/logo/fitematch.png',
          },
          status: CompanyStatusEnum.ACTIVE,
          approval: {
            approvedAt: new Date(),
          },
        },
        $setOnInsert: {
          slug: COMPANY_SLUG,
        },
      },
      {
        upsert: true,
        session,
      },
    );

    const company = await companyModel
      .findOne({ slug: COMPANY_SLUG }, { _id: 1 })
      .session(session ?? null)
      .lean()
      .exec();

    if (company) {
      await userModel.updateOne(
        {
          email: RECRUITER_EMAIL,
          productRole: ProductRoleEnum.RECRUITER,
        },
        {
          $set: {
            'recruiterProfile.companyId': company._id.toString(),
          },
        },
        { session },
      );
    }

    logger.log(`Company seed ensured active company "${COMPANY_SLUG}".`);
  },

  async rollback({ connection, logger, session }) {
    const companyModel = connection.model<CompanyDocument>(CompanySchema.name);
    const userModel = connection.model<UserDocument>(UserSchema.name);

    const company = await companyModel
      .findOne({ slug: COMPANY_SLUG }, { _id: 1 })
      .session(session ?? null)
      .lean()
      .exec();

    if (company) {
      await userModel.updateOne(
        {
          email: RECRUITER_EMAIL,
          productRole: ProductRoleEnum.RECRUITER,
        },
        {
          $unset: {
            'recruiterProfile.companyId': '',
          },
        },
        { session },
      );
    }

    await companyModel.deleteOne({ slug: COMPANY_SLUG }, { session }).exec();

    logger.log(`Company seed rollback removed "${COMPANY_SLUG}".`);
  },
};

export default seed;
