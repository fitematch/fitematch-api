import * as bcrypt from 'bcrypt';
import {
  UserSchema,
  type UserDocument,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';
import type { SeedInterface } from '@src/shared/database/seeds/contracts/seed.interface';

const CANDIDATE_EMAIL = 'candidate@fitematch.com.br';
const CANDIDATE_PASSWORD = 'password123';

const seed: SeedInterface = {
  name: '202605150006_candidate_user.seed.ts',

  async run({ connection, logger, session }) {
    const userModel = connection.model<UserDocument>(UserSchema.name);
    const passwordHash = await bcrypt.hash(CANDIDATE_PASSWORD, 10);

    await userModel.updateOne(
      { email: CANDIDATE_EMAIL },
      {
        $set: {
          name: 'Sherry Birkin',
          email: CANDIDATE_EMAIL,
          password: passwordHash,
          birthday: new Date('1986-01-01T00:00:00.000Z'),
          status: UserStatusEnum.ACTIVE,
          productRole: ProductRoleEnum.CANDIDATE,
        },
      },
      {
        upsert: true,
        session,
      },
    );

    logger.log(`Candidate user seed ensured user "${CANDIDATE_EMAIL}".`);
  },

  async rollback({ connection, logger, session }) {
    const userModel = connection.model<UserDocument>(UserSchema.name);

    await userModel
      .deleteOne(
        {
          email: CANDIDATE_EMAIL,
          productRole: ProductRoleEnum.CANDIDATE,
        },
        { session },
      )
      .exec();

    logger.log(`Candidate user seed rollback removed "${CANDIDATE_EMAIL}".`);
  },
};

export default seed;
