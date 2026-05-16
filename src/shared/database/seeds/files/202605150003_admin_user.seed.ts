import * as bcrypt from 'bcrypt';
import {
  UserSchema,
  type UserDocument,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';
import type { SeedInterface } from '@src/shared/database/seeds/contracts/seed.interface';

const ADMIN_EMAIL = 'admin@fitematch.com.br';
const ADMIN_PASSWORD = 'adminadmin';

const seed: SeedInterface = {
  name: '202605150003_admin_user.seed.ts',

  async run({ connection, logger, session }) {
    const userModel = connection.model<UserDocument>(UserSchema.name);
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await userModel.updateOne(
      { email: ADMIN_EMAIL },
      {
        $set: {
          name: 'Super User',
          email: ADMIN_EMAIL,
          password: passwordHash,
          birthday: new Date('1990-01-01T00:00:00.000Z'),
          status: UserStatusEnum.ACTIVE,
          adminRole: AdminRoleEnum.ADMIN,
        },
      },
      {
        upsert: true,
        session,
      },
    );

    logger.log(`Admin user seed ensured user "${ADMIN_EMAIL}".`);
  },

  async rollback({ connection, logger, session }) {
    const userModel = connection.model<UserDocument>(UserSchema.name);

    await userModel
      .deleteOne(
        {
          email: ADMIN_EMAIL,
          adminRole: AdminRoleEnum.ADMIN,
        },
        { session },
      )
      .exec();

    logger.log(`Admin user seed rollback removed "${ADMIN_EMAIL}".`);
  },
};

export default seed;
