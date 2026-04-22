import type { GetMeOutputDto } from '@src/modules/auth/application/dto/output/get-me.output.dto';

export interface GetMeRepositoryInterface {
  findById(id: string): Promise<GetMeOutputDto | null>;
}
