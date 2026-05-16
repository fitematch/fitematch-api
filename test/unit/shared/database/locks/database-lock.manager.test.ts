import { ConflictException, Logger } from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { DatabaseLockManager } from '@src/shared/database/locks/database-lock.manager';

describe('DatabaseLockManager', () => {
  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should acquire and release lock around callback', async () => {
    const model = {
      create: jest.fn().mockResolvedValue(undefined),
      deleteOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      }),
    };
    const manager = new DatabaseLockManager(model as never);

    const result = await manager.executeWithLock('migrations', () =>
      Promise.resolve('done'),
    );

    expect(result).toBe('done');
    expect(model.create).toHaveBeenCalledWith({
      key: 'migrations',
      lockedAt: expect.any(Date),
    });
    expect(model.deleteOne).toHaveBeenCalledWith({ key: 'migrations' });
  });

  it('should release lock when callback throws', async () => {
    const deleteExec = jest.fn().mockResolvedValue({ deletedCount: 1 });
    const model = {
      create: jest.fn().mockResolvedValue(undefined),
      deleteOne: jest.fn().mockReturnValue({
        exec: deleteExec,
      }),
    };
    const manager = new DatabaseLockManager(model as never);

    await expect(
      manager.executeWithLock('migrations', () =>
        Promise.reject(new Error('failure')),
      ),
    ).rejects.toThrow('failure');

    expect(deleteExec).toHaveBeenCalledTimes(1);
  });

  it('should throw conflict exception when lock already exists', async () => {
    const duplicateKeyError = new MongoServerError({
      ok: 0,
      errmsg: 'duplicate key',
      code: 11000,
    });
    const model = {
      create: jest.fn().mockRejectedValue(duplicateKeyError),
      deleteOne: jest.fn(),
    };
    const manager = new DatabaseLockManager(model as never);

    await expect(
      manager.executeWithLock('migrations', () => Promise.resolve('done')),
    ).rejects.toThrow(
      new ConflictException(
        'Database runner is already locked for key "migrations".',
      ),
    );
    expect(model.deleteOne).not.toHaveBeenCalled();
  });
});
