import * as bcrypt from 'bcrypt';
import {
  UserSchema,
  type UserDocument,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';
import type { SeedInterface } from '@src/shared/database/seeds/contracts/seed.interface';

const SUPER_ADMIN_EMAIL = 'root@fitematch.com.br';
const SUPER_ADMIN_PASSWORD = 'toortoor';

const seed: SeedInterface = {
  name: '202605150002_super_admin.seed.ts',

  async run({ connection, logger, session }) {
    const userModel = connection.model<UserDocument>(UserSchema.name);
    const passwordHash = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);

    await userModel.updateOne(
      { email: SUPER_ADMIN_EMAIL },
      {
        $set: {
          name: 'Super Admin',
          email: SUPER_ADMIN_EMAIL,
          password: passwordHash,
          birthday: new Date('1990-01-01T00:00:00.000Z'),
          status: UserStatusEnum.ACTIVE,
          adminRole: AdminRoleEnum.SUPER_ADMIN,
        },
      },
      {
        upsert: true,
        session,
      },
    );

    logger.log(
      `Super admin seed ensured user "${SUPER_ADMIN_EMAIL}" with active access.`,
    );
  },

  async rollback({ connection, logger, session }) {
    const userModel = connection.model<UserDocument>(UserSchema.name);

    await userModel
      .deleteOne(
        {
          email: SUPER_ADMIN_EMAIL,
          adminRole: AdminRoleEnum.SUPER_ADMIN,
        },
        { session },
      )
      .exec();

    logger.log(`Super admin seed rollback removed "${SUPER_ADMIN_EMAIL}".`);
  },
};

export default seed;
