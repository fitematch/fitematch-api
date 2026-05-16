import * as bcrypt from 'bcrypt';
import {
  UserSchema,
  type UserDocument,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';
import type { SeedInterface } from '@src/shared/database/seeds/contracts/seed.interface';

const STAFF_EMAIL = 'staff@fitematch.com.br';
const STAFF_PASSWORD = 'staffstaff';

const seed: SeedInterface = {
  name: '202605150004_staff_user.seed.ts',

  async run({ connection, logger, session }) {
    const userModel = connection.model<UserDocument>(UserSchema.name);
    const passwordHash = await bcrypt.hash(STAFF_PASSWORD, 10);

    await userModel.updateOne(
      { email: STAFF_EMAIL },
      {
        $set: {
          name: 'Staff',
          email: STAFF_EMAIL,
          password: passwordHash,
          birthday: new Date('1990-01-01T00:00:00.000Z'),
          status: UserStatusEnum.ACTIVE,
          adminRole: AdminRoleEnum.STAFF,
          productRole: ProductRoleEnum.RECRUITER,
        },
      },
      {
        upsert: true,
        session,
      },
    );

    logger.log(`Staff user seed ensured user "${STAFF_EMAIL}".`);
  },

  async rollback({ connection, logger, session }) {
    const userModel = connection.model<UserDocument>(UserSchema.name);

    await userModel
      .deleteOne(
        {
          email: STAFF_EMAIL,
          adminRole: AdminRoleEnum.STAFF,
        },
        { session },
      )
      .exec();

    logger.log(`Staff user seed rollback removed "${STAFF_EMAIL}".`);
  },
};

export default seed;
