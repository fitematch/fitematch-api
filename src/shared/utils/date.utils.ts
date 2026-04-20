import { Injectable } from '@nestjs/common';

@Injectable()
export default class DateUtils {
  /**
   * Format date into a specific string format.
   *
   * @param {string} date The date to format.
   * @returns {string} The formatted date.
   */
  formatDate(date: string): string {
    const [year, month, day] = date.split('-');

    return `${day}/${month}/${year}`;
  }
}
