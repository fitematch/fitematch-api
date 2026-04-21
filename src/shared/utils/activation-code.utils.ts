export class ActivationCodeUtils {
  /**
   * Generates a six-digit activation code.
   * @returns {string} A six-digit activation code.
   */
  public static generateSixDigits(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
