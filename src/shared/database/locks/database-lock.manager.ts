import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoServerError } from 'mongodb';
import type { Model } from 'mongoose';
import {
  LockSchema,
  type LockDocument,
} from '@src/shared/database/locks/schemas/lock.schema';
import type { DatabaseLockManagerInterface } from '@src/shared/database/locks/contracts/database-lock-manager.interface';

@Injectable()
export class DatabaseLockManager implements DatabaseLockManagerInterface {
  private readonly logger = new Logger(DatabaseLockManager.name);

  constructor(
    @InjectModel(LockSchema.name)
    private readonly lockModel: Model<LockDocument>,
  ) {}

  async executeWithLock<T>(
    key: string,
    callback: () => Promise<T>,
  ): Promise<T> {
    await this.acquire(key);

    try {
      return await callback();
    } finally {
      await this.release(key);
    }
  }

  private async acquire(key: string): Promise<void> {
    try {
      await this.lockModel.create({
        key,
        lockedAt: new Date(),
      });

      this.logger.log(`Lock acquired: ${key}`);
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        throw new ConflictException(
          `Database runner is already locked for key "${key}".`,
        );
      }

      throw error;
    }
  }

  private async release(key: string): Promise<void> {
    await this.lockModel.deleteOne({ key }).exec();
    this.logger.log(`Lock released: ${key}`);
  }
}
