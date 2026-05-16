export class MigrationRecordDto {
  name!: string;
  batch!: number;
  checksum!: string;
  executedAt!: Date;
}
