import type { RefreshTokenInputDto } from '@src/modules/auth/application/dto/input/refresh-token.input.dto';
import type { RefreshTokenOutputDto } from '@src/modules/auth/application/dto/output/refresh-token.output.dto';

export interface RefreshTokenUseCaseInterface {
  execute(input: RefreshTokenInputDto): Promise<RefreshTokenOutputDto>;
}
