import type { Logger } from '@nestjs/common';
import type { Connection, ClientSession } from 'mongoose';

export interface SeedContext {
  connection: Connection;
  logger: Logger;
  session?: ClientSession;
}

export interface SeedInterface {
  name: string;
  run(context: SeedContext): Promise<void>;
  rollback?(context: SeedContext): Promise<void>;
}
