import * as bcrypt from 'bcrypt';
import {
  UserSchema,
  type UserDocument,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';
import type { SeedInterface } from '@src/shared/database/seeds/contracts/seed.interface';

const RECRUITER_EMAIL = 'recruiter@fitematch.com.br';
const RECRUITER_PASSWORD = 'password123';

const seed: SeedInterface = {
  name: '202605150005_recruiter_user.seed.ts',

  async run({ connection, logger, session }) {
    const userModel = connection.model<UserDocument>(UserSchema.name);
    const passwordHash = await bcrypt.hash(RECRUITER_PASSWORD, 10);

    await userModel.updateOne(
      { email: RECRUITER_EMAIL },
      {
        $set: {
          name: 'Leon Kenedy',
          email: RECRUITER_EMAIL,
          password: passwordHash,
          birthday: new Date('1977-01-01T00:00:00.000Z'),
          status: UserStatusEnum.ACTIVE,
          productRole: ProductRoleEnum.RECRUITER,
        },
      },
      {
        upsert: true,
        session,
      },
    );

    logger.log(`Recruiter user seed ensured user "${RECRUITER_EMAIL}".`);
  },

  async rollback({ connection, logger, session }) {
    const userModel = connection.model<UserDocument>(UserSchema.name);

    await userModel
      .deleteOne(
        {
          email: RECRUITER_EMAIL,
          productRole: ProductRoleEnum.RECRUITER,
        },
        { session },
      )
      .exec();

    logger.log(`Recruiter user seed rollback removed "${RECRUITER_EMAIL}".`);
  },
};

export default seed;
