import type { Logger } from '@nestjs/common';
import type { Connection } from 'mongoose';

export interface MigrationContext {
  connection: Connection;
  logger: Logger;
}

export interface MigrationInterface {
  name: string;
  up(context: MigrationContext): Promise<void>;
  down(context: MigrationContext): Promise<void>;
}
