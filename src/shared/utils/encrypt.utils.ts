import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export default class EncryptUtils {
  /**
   * Encrypts a plain text password.
   *
   * @param {string} password The plain text password to encrypt.
   * @returns {Promise<string>} The encrypted password.
   */
  async encryptPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    return hash;
  }

  /**
   * Compares a plain text password with a hashed password.
   *
   * @param {string} password The plain text password to compare.
   * @param {string} hashedPassword The hashed password to compare against.
   * @returns {Promise<boolean>} A boolean indicating whether the passwords match.
   */
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
