import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { HashServiceInterface } from '@src/modules/auth/application/contracts/services/hash.service.interface';

@Injectable()
export class PasswordHashService implements HashServiceInterface {
  public async hash(value: string): Promise<string> {
    return bcrypt.hash(value, 10);
  }

  public async compare(value: string, hashedValue: string): Promise<boolean> {
    return bcrypt.compare(value, hashedValue);
  }
}
