import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { DatabaseFileUtils } from '@src/shared/database/utils/database-file.utils';

describe('DatabaseFileUtils', () => {
  const fixturesDirectoryPath = path.join(
    process.cwd(),
    'tmp',
    'database-file-utils',
  );

  beforeEach(async () => {
    await rm(fixturesDirectoryPath, { recursive: true, force: true });
    await mkdir(fixturesDirectoryPath, { recursive: true });
  });

  afterEach(async () => {
    await rm(fixturesDirectoryPath, { recursive: true, force: true });
  });

  it('should list timestamped files ordered by file name and include checksums', async () => {
    await writeFile(
      path.join(fixturesDirectoryPath, '202605140002_second.seed.ts'),
      'export default {};',
    );
    await writeFile(
      path.join(fixturesDirectoryPath, '202605140001_first.migration.ts'),
      'export default {};',
    );
    await writeFile(path.join(fixturesDirectoryPath, 'notes.txt'), 'ignored');

    const result = await DatabaseFileUtils.listTimestampedFiles(
      fixturesDirectoryPath,
    );

    expect(result.map((item) => item.name)).toEqual([
      '202605140001_first.migration.ts',
      '202605140002_second.seed.ts',
    ]);
    expect(result[0]?.checksum).toHaveLength(64);
    expect(result[1]?.checksum).toHaveLength(64);
  });
});
