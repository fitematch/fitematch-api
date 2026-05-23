import { Logger } from '@nestjs/common';
import { MigrationRunner } from '@src/shared/database/migrations/runners/migration.runner';
import { DatabaseFileUtils } from '@src/shared/database/utils/database-file.utils';

describe('MigrationRunner', () => {
  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should execute pending migrations in order and persist batch metadata', async () => {
    const migration = {
      name: '202605140001_create_email_templates.migration.ts',
      up: jest.fn().mockResolvedValue(undefined),
      down: jest.fn(),
    };
    const connection = {} as never;
    const migrationModel = {
      find: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([]),
        }),
      }),
      create: jest.fn().mockResolvedValue(undefined),
    };
    const lockManager = {
      executeWithLock: jest.fn().mockImplementation((_key, callback) => {
        return callback() as Promise<unknown>;
      }),
    };
    const runner = new MigrationRunner(
      connection,
      migrationModel as never,
      lockManager,
    );

    jest.spyOn(DatabaseFileUtils, 'listTimestampedFiles').mockResolvedValue([
      {
        name: migration.name,
        checksum: 'checksum-1',
        absolutePath: '/tmp/migration.ts',
      },
    ]);
    jest.spyOn(runner as any, 'loadMigration').mockReturnValue(migration);

    const result = await runner.run();

    expect(lockManager.executeWithLock).toHaveBeenCalledWith(
      'migrations',
      expect.any(Function),
    );
    expect(migration.up).toHaveBeenCalledWith({
      connection,
      logger: expect.any(Logger),
    });
    expect(migrationModel.create).toHaveBeenCalledWith({
      name: migration.name,
      batch: 1,
      checksum: 'checksum-1',
      executedAt: expect.any(Date),
    });
    expect(result).toEqual({
      processedNames: [migration.name],
      skippedNames: [],
      batch: 1,
    });
  });

  it('should skip executed migrations with matching checksum', async () => {
    const migrationModel = {
      find: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([
            {
              name: '202605140001_create_email_templates.migration.ts',
              checksum: 'checksum-1',
              batch: 1,
            },
          ]),
        }),
      }),
      create: jest.fn(),
    };
    const lockManager = {
      executeWithLock: jest.fn().mockImplementation((_key, callback) => {
        return callback() as Promise<unknown>;
      }),
    };
    const runner = new MigrationRunner(
      {} as never,
      migrationModel as never,
      lockManager,
    );

    jest.spyOn(DatabaseFileUtils, 'listTimestampedFiles').mockResolvedValue([
      {
        name: '202605140001_create_email_templates.migration.ts',
        checksum: 'checksum-1',
        absolutePath: '/tmp/migration.ts',
      },
    ]);

    const result = await runner.run();

    expect(migrationModel.create).not.toHaveBeenCalled();
    expect(result.processedNames).toEqual([]);
    expect(result.skippedNames).toEqual([
      '202605140001_create_email_templates.migration.ts',
    ]);
  });

  it('should throw when executed migration checksum differs', async () => {
    const migrationModel = {
      find: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([
            {
              name: '202605140001_create_email_templates.migration.ts',
              checksum: 'checksum-old',
              batch: 1,
            },
          ]),
        }),
      }),
      create: jest.fn(),
    };
    const lockManager = {
      executeWithLock: jest.fn().mockImplementation((_key, callback) => {
        return callback() as Promise<unknown>;
      }),
    };
    const runner = new MigrationRunner(
      {} as never,
      migrationModel as never,
      lockManager,
    );

    jest.spyOn(DatabaseFileUtils, 'listTimestampedFiles').mockResolvedValue([
      {
        name: '202605140001_create_email_templates.migration.ts',
        checksum: 'checksum-new',
        absolutePath: '/tmp/migration.ts',
      },
    ]);

    await expect(runner.run()).rejects.toThrow(
      'Checksum mismatch detected for migration "202605140001_create_email_templates.migration.ts".',
    );
  });
});
