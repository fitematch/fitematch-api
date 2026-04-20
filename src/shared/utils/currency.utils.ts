import { Injectable } from '@nestjs/common';

@Injectable()
export default class CurrencyUtils {
  /**
   * Format amount into Brazilian Real currency.
   *
   * @param {number} amount The amount to format.
   * @returns {string} The formatted amount.
   */
  formatBRL(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  }
}
