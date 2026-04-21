export class CnpjUtils {
  public normalize(value: string | undefined): string | undefined {
    const normalizedValue = value?.replace(/\D/g, '');

    return normalizedValue || undefined;
  }

  public isValid(value: string | undefined): boolean {
    const normalizedValue = this.normalize(value);

    if (!normalizedValue || normalizedValue.length !== 14) {
      return false;
    }

    if (/^(\d)\1{13}$/.test(normalizedValue)) {
      return false;
    }

    const firstCheckDigit = this.calculateCheckDigit(
      normalizedValue.slice(0, 12),
    );
    const secondCheckDigit = this.calculateCheckDigit(
      [normalizedValue.slice(0, 12), String(firstCheckDigit)].join(''),
    );

    return (
      normalizedValue ===
      `${normalizedValue.slice(0, 12)}${firstCheckDigit}${secondCheckDigit}`
    );
  }

  private calculateCheckDigit(baseValue: string): number {
    const weights =
      baseValue.length === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const sum = baseValue
      .split('')
      .reduce(
        (accumulator, digit, index) =>
          accumulator + Number(digit) * weights[index],
        0,
      );

    const remainder = sum % 11;

    return remainder < 2 ? 0 : 11 - remainder;
  }
}
