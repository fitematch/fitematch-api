import { Injectable } from '@nestjs/common';
import type { SignOutUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/sign-out.use-case.interface';
import type { SignOutInputDto } from '@src/modules/auth/application/dto/input/sign-out.input.dto';
import type { SignOutOutputDto } from '@src/modules/auth/application/dto/output/sign-out.output.dto';

@Injectable()
export class SignOutUseCase implements SignOutUseCaseInterface {
  public execute(input: SignOutInputDto): Promise<SignOutOutputDto> {
    void input;

    return Promise.resolve({
      message: 'Signed out successfully.',
    });
  }
}
