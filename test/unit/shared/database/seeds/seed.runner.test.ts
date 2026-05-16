import { Logger } from '@nestjs/common';
import { SeedRunner } from '@src/shared/database/seeds/runners/seed.runner';
import { DatabaseFileUtils } from '@src/shared/database/utils/database-file.utils';

describe('SeedRunner', () => {
  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should execute pending seeds and persist execution metadata', async () => {
    const seed = {
      name: '202605140001_email_templates.seed.ts',
      run: jest.fn().mockResolvedValue(undefined),
    };
    const session = {
      withTransaction: jest.fn().mockImplementation((callback) => {
        return callback() as Promise<unknown>;
      }),
      endSession: jest.fn().mockResolvedValue(undefined),
    };
    const connection = {
      startSession: jest.fn().mockResolvedValue(session),
    };
    const seedModel = {
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
    const runner = new SeedRunner(
      connection as never,
      seedModel as never,
      lockManager,
    );

    jest.spyOn(DatabaseFileUtils, 'listTimestampedFiles').mockResolvedValue([
      {
        name: seed.name,
        checksum: 'checksum-1',
        absolutePath: '/tmp/seed.ts',
      },
    ]);
    jest.spyOn(runner as any, 'loadSeed').mockReturnValue(seed as never);

    const result = await runner.run();

    expect(connection.startSession).toHaveBeenCalledTimes(1);
    expect(seed.run).toHaveBeenCalledWith({
      connection,
      logger: expect.any(Logger),
      session,
    });
    expect(seedModel.create).toHaveBeenCalledWith(
      [
        {
          name: seed.name,
          checksum: 'checksum-1',
          executedAt: expect.any(Date),
        },
      ],
      { session },
    );
    expect(result.processedNames).toEqual([seed.name]);
  });

  it('should throw when executed seed checksum differs', async () => {
    const seedModel = {
      find: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([
            {
              name: '202605140001_email_templates.seed.ts',
              checksum: 'checksum-old',
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
    const runner = new SeedRunner(
      {
        startSession: jest.fn(),
      } as never,
      seedModel as never,
      lockManager,
    );

    jest.spyOn(DatabaseFileUtils, 'listTimestampedFiles').mockResolvedValue([
      {
        name: '202605140001_email_templates.seed.ts',
        checksum: 'checksum-new',
        absolutePath: '/tmp/seed.ts',
      },
    ]);

    await expect(runner.run()).rejects.toThrow(
      'Checksum mismatch detected for seed "202605140001_email_templates.seed.ts".',
    );
  });
});
