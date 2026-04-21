export class SlugUtils {
  /**
   * Generate a slug from a given string by:
   *
   * @param {string} value - The input string to be converted into a slug.
   * @returns {string} - The generated slug.
   */
  public static generate(value: string): string {
    if (!value) return '';

    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  public static generateWithSuffix(value: string, suffix: number): string {
    const baseSlug = SlugUtils.generate(value);

    if (!baseSlug) return String(suffix);

    return `${baseSlug}-${suffix}`;
  }
}
