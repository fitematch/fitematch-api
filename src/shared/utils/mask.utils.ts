export class MaskUtils {
  /**
   * Converts the input value to a string.
   * @param {string | number | null | undefined} value - The value to be converted to a string.
   * @returns {string} - The string representation of the input value.
   */
  private toString(value: string | number | null | undefined): string {
    if (value === null || value === undefined) {
      return '';
    }

    return String(value);
  }

  /**
   * Removes all non-digit characters from the input.
   *
   * @param {string | number | null | undefined} value - The value to be processed.
   * @returns {string} - The string containing only digits.
   */
  private digits(value: string | number | null | undefined): string {
    return this.toString(value).replace(/\D/g, '');
  }

  /**
   * Removes all non-alphanumeric characters from the input.
   *
   * @param {string | number | null | undefined} value - The value to be processed.
   * @returns {string} - The string containing only alphanumeric characters.
   */
  private alphaNum(value: string | number | null | undefined): string {
    return this.toString(value).replace(/[^a-zA-Z0-9]/g, '');
  }

  /**
   * Formats phone number.
   *
   * @param {string | number | null | undefined} value - The value to be formatted.
   * @returns {string} - The formatted phone number.
   */
  formatPhone(value: string | number | null | undefined): string {
    const v = this.digits(value).slice(0, 11);

    if (!v) return '';

    if (v.length <= 2) return `(${v}`;
    if (v.length <= 6) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
    if (v.length <= 10)
      return `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;

    return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
  }

  /**
   * Formats CPF - Cadastro de Pessoas Físicas.
   *
   * @param {string | number | null | undefined} value - The value to be formatted.
   * @returns {string} - The formatted CPF.
   */
  formatCPF(value: string | number | null | undefined): string {
    const v = this.digits(value).slice(0, 11);

    if (!v) return '';

    if (v.length <= 3) return v;
    if (v.length <= 6) return `${v.slice(0, 3)}.${v.slice(3)}`;
    if (v.length <= 9) return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6)}`;

    return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6, 9)}-${v.slice(9)}`;
  }

  /**
   * Formats CNPJ - Cadastro Nacional da Pessoa Jurídica.
   *
   * @param {string | number | null | undefined} value - The value to be formatted.
   * @returns {string} - The formatted CNPJ.
   */
  formatCNPJ(value: string | number | null | undefined): string {
    const v = this.alphaNum(value).toUpperCase().slice(0, 14);

    if (!v) return '';

    if (v.length <= 2) return v;
    if (v.length <= 5) return `${v.slice(0, 2)}.${v.slice(2)}`;
    if (v.length <= 8) return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5)}`;
    if (v.length <= 12)
      return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5, 8)}/${v.slice(8)}`;

    return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5, 8)}/${v.slice(
      8,
      12,
    )}-${v.slice(12)}`;
  }

  /**
   * Formats RG - Registro Geral.
   *
   * @param {string | number | null | undefined} value - The value to be formatted.
   * @returns {string} - The formatted RG.
   */
  formatRG(value: string | number | null | undefined): string {
    const v = this.alphaNum(value).toUpperCase().slice(0, 9);

    if (!v) return '';

    if (v.length <= 2) return v;
    if (v.length <= 5) return `${v.slice(0, 2)}.${v.slice(2)}`;
    if (v.length <= 8) return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5)}`;

    return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5, 8)}-${v.slice(8)}`;
  }

  /**
   * Formats CEP - Código de Endereçamento Postal.
   *
   * @param {string | number | null | undefined} value - The value to be formatted.
   * @returns {string} - The formatted CEP.
   */
  formatCEP(value: string | number | null | undefined): string {
    const v = this.digits(value).slice(0, 8);

    if (!v) return '';

    if (v.length <= 5) return v;

    return `${v.slice(0, 5)}-${v.slice(5)}`;
  }

  /**
   * Formats CREF - Conselho Regional de Educacao Fisica.
   *
   * @param {string | number | null | undefined} value - The value to be formatted.
   * @returns {string} - The formatted CREF.
   */
  formatCREF(value: string | number | null | undefined): string {
    const v = this.alphaNum(value).toUpperCase().slice(0, 9);

    if (!v) return '';

    if (v.length <= 6) return v;
    if (v.length <= 7) return `${v.slice(0, 6)}-${v.slice(6)}`;

    return `${v.slice(0, 6)}-${v.slice(6, 7)}/${v.slice(7)}`;
  }

  /**
   * Formats passport number.
   *
   * @param {string | number | null | undefined} value - The value to be formatted.
   * @returns {string} - The formatted passport number.
   */
  formatPassport(value: string | number | null | undefined): string {
    return this.alphaNum(value).toUpperCase().slice(0, 9);
  }
}
