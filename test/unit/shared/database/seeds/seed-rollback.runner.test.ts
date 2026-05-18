import { Logger } from '@nestjs/common';
import { SeedRollbackRunner } from '@src/shared/database/seeds/runners/seed-rollback.runner';

describe('SeedRollbackRunner', () => {
  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should rollback the latest seed when rollback is available', async () => {
    const seed = {
      name: '202605140001_email_templates.seed.ts',
      run: jest.fn(),
      rollback: jest.fn().mockResolvedValue(undefined),
    };
    const connection = {
      startSession: jest.fn(),
    };
    const seedModel = {
      findOne: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue({
              name: seed.name,
            }),
          }),
        }),
      }),
      deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    };
    const lockManager = {
      executeWithLock: jest.fn().mockImplementation((_key, callback) => {
        return callback() as Promise<unknown>;
      }),
    };
    const runner = new SeedRollbackRunner(
      connection as never,
      seedModel as never,
      lockManager,
    );

    jest.spyOn(runner as any, 'loadSeed').mockReturnValue(seed);

    const result = await runner.run();

    expect(connection.startSession).not.toHaveBeenCalled();
    expect(seed.rollback).toHaveBeenCalledWith({
      connection,
      logger: expect.any(Logger),
    });
    expect(seedModel.deleteOne).toHaveBeenCalledWith({ name: seed.name });
    expect(result.processedNames).toEqual([seed.name]);
  });

  it('should skip latest seed when rollback is not available', async () => {
    const seedModel = {
      findOne: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue({
              name: '202605140001_email_templates.seed.ts',
            }),
          }),
        }),
      }),
    };
    const lockManager = {
      executeWithLock: jest.fn().mockImplementation((_key, callback) => {
        return callback() as Promise<unknown>;
      }),
    };
    const runner = new SeedRollbackRunner(
      {
        startSession: jest.fn(),
      } as never,
      seedModel as never,
      lockManager,
    );

    jest.spyOn(runner as any, 'loadSeed').mockReturnValue({
      name: '202605140001_email_templates.seed.ts',
      run: jest.fn(),
    });

    const result = await runner.run();

    expect(result).toEqual({
      processedNames: [],
      skippedNames: ['202605140001_email_templates.seed.ts'],
    });
  });
});
