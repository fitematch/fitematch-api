import path from 'node:path';

export function sanitizeFileName(fileName: string): string {
  const extension = path.extname(fileName);
  const baseName = path.basename(fileName, extension);

  const sanitizedBaseName = baseName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

  return sanitizedBaseName || 'file';
}

export function buildUploadFileName(fileName: string): string {
  const extension = path.extname(fileName).toLowerCase();
  const sanitizedBaseName = sanitizeFileName(fileName);

  return `${sanitizedBaseName}-${Date.now()}${extension}`;
}
