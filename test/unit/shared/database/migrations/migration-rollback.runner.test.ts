import { Logger } from '@nestjs/common';
import { MigrationRollbackRunner } from '@src/shared/database/migrations/runners/migration-rollback.runner';

describe('MigrationRollbackRunner', () => {
  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should rollback the last executed migration', async () => {
    const migration = {
      name: '202605140001_create_email_templates.migration.ts',
      up: jest.fn(),
      down: jest.fn().mockResolvedValue(undefined),
    };
    const deleteExec = jest.fn().mockResolvedValue({ deletedCount: 1 });
    const migrationModel = {
      findOne: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue({
              name: migration.name,
              batch: 3,
            }),
          }),
        }),
      }),
      deleteOne: jest.fn().mockReturnValue({
        exec: deleteExec,
      }),
    };
    const lockManager = {
      executeWithLock: jest.fn().mockImplementation((_key, callback) => {
        return callback() as Promise<unknown>;
      }),
    };
    const runner = new MigrationRollbackRunner(
      {} as never,
      migrationModel as never,
      lockManager,
    );

    jest.spyOn(runner as any, 'loadMigration').mockReturnValue(migration);

    const result = await runner.run();

    expect(migration.down).toHaveBeenCalledWith({
      connection: expect.anything(),
      logger: expect.any(Logger),
    });
    expect(migrationModel.deleteOne).toHaveBeenCalledWith({
      name: migration.name,
    });
    expect(result).toEqual({
      processedNames: [migration.name],
      skippedNames: [],
      batch: 3,
    });
  });
});
