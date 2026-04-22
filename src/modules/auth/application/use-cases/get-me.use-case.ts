import { Inject, Injectable } from '@nestjs/common';
import { GET_ME_REPOSITORY } from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { GetMeUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/get-me.use-case.interface';
import type { GetMeRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/get-me.repository.interface';
import type { GetMeInputDto } from '@src/modules/auth/application/dto/input/get-me.input.dto';
import type { GetMeOutputDto } from '@src/modules/auth/application/dto/output/get-me.output.dto';

@Injectable()
export class GetMeUseCase implements GetMeUseCaseInterface {
  constructor(
    @Inject(GET_ME_REPOSITORY)
    private readonly getMeRepository: GetMeRepositoryInterface,
  ) {}

  public async execute(input: GetMeInputDto): Promise<GetMeOutputDto | null> {
    return this.getMeRepository.findById(input.userId);
  }
}
