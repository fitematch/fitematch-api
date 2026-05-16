import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { DatabaseFileMetadataDto } from '@src/shared/database/dto/database-file-metadata.dto';

const TIMESTAMPED_FILE_PATTERN = /^\d{12}_.+\.(migration|seed)\.ts$/;

export class DatabaseFileUtils {
  static async listTimestampedFiles(
    directoryPath: string,
  ): Promise<DatabaseFileMetadataDto[]> {
    const directoryEntries = await readdir(directoryPath, {
      withFileTypes: true,
    });

    const matchedFiles = directoryEntries
      .filter(
        (entry) => entry.isFile() && TIMESTAMPED_FILE_PATTERN.test(entry.name),
      )
      .sort((left, right) => left.name.localeCompare(right.name));

    return Promise.all(
      matchedFiles.map(async (entry) => {
        const absolutePath = path.join(directoryPath, entry.name);
        const checksum = await this.calculateChecksum(absolutePath);

        return {
          name: entry.name,
          checksum,
          absolutePath,
        };
      }),
    );
  }

  static async calculateChecksum(absolutePath: string): Promise<string> {
    const fileContent = await readFile(absolutePath, 'utf-8');

    return createHash('sha256').update(fileContent).digest('hex');
  }
}
