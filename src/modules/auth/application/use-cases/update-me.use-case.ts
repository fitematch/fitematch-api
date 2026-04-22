import { Inject, Injectable } from '@nestjs/common';
import { UPDATE_ME_REPOSITORY } from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { UpdateMeUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/update-me.use-case.interface';
import type { UpdateMeRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/update-me.repository.interface';
import type { UpdateMeInputDto } from '@src/modules/auth/application/dto/input/update-me.input.dto';
import type { UpdateMeOutputDto } from '@src/modules/auth/application/dto/output/update-me.output.dto';

@Injectable()
export class UpdateMeUseCase implements UpdateMeUseCaseInterface {
  constructor(
    @Inject(UPDATE_ME_REPOSITORY)
    private readonly updateMeRepository: UpdateMeRepositoryInterface,
  ) {}

  public async execute(
    input: UpdateMeInputDto,
  ): Promise<UpdateMeOutputDto | null> {
    return this.updateMeRepository.update(input);
  }
}
